
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

// Define data types
type Message = {
  id: string;
  roomId: string;
  content: string;
  userId: string;
  username: string;
  timestamp: number;
  formattedContent?: JSX.Element;
};

type Room = {
  id: string;
  name: string;
  createdBy: string;
};

type ChatContextType = {
  rooms: Room[];
  messages: Message[];
  currentRoom: Room | null;
  createRoom: (name: string) => Promise<boolean>;
  joinRoom: (roomId: string) => void;
  sendMessage: (content: string) => void;
  formatMessage: (content: string) => JSX.Element | null;
  isLoading: boolean;
};

// Create chat context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Format message content (bold, italic, links)
  const formatMessage = (content: string): JSX.Element | null => {
    if (!content) return null;

    // Replace patterns with formatting
    const parts: JSX.Element[] = [];
    
    let remaining = content;
    let index = 0;
    
    // Process bold text
    const boldRegex = /\*\*(.*?)\*\*/g;
    let boldMatch;
    let lastIndex = 0;
    
    while ((boldMatch = boldRegex.exec(remaining)) !== null) {
      if (boldMatch.index > lastIndex) {
        parts.push(<span key={`text-${index++}`}>{remaining.substring(lastIndex, boldMatch.index)}</span>);
      }
      parts.push(<span key={`bold-${index++}`} className="format-bold">{boldMatch[1]}</span>);
      lastIndex = boldMatch.index + boldMatch[0].length;
    }
    
    if (lastIndex < remaining.length) {
      remaining = remaining.substring(lastIndex);
    } else {
      remaining = "";
    }
    
    // Process italic text on the remaining content
    if (remaining) {
      const italicRegex = /\*(.*?)\*/g;
      let italicMatch;
      let lastItalicIndex = 0;
      const italicParts: JSX.Element[] = [];
      
      while ((italicMatch = italicRegex.exec(remaining)) !== null) {
        if (italicMatch.index > lastItalicIndex) {
          italicParts.push(<span key={`text-${index++}`}>{remaining.substring(lastItalicIndex, italicMatch.index)}</span>);
        }
        italicParts.push(<span key={`italic-${index++}`} className="format-italic">{italicMatch[1]}</span>);
        lastItalicIndex = italicMatch.index + italicMatch[0].length;
      }
      
      if (lastItalicIndex < remaining.length) {
        italicParts.push(<span key={`text-${index++}`}>{remaining.substring(lastItalicIndex)}</span>);
      }
      
      if (italicParts.length > 0) {
        parts.push(...italicParts);
      } else {
        parts.push(<span key={`text-${index++}`}>{remaining}</span>);
      }
    }
    
    // Process links in the entire content
    const processLinks = (elements: JSX.Element[]): JSX.Element[] => {
      return elements.map(el => {
        if (el.type !== 'span' || !el.props.children || typeof el.props.children !== 'string') {
          return el;
        }
        
        const text = el.props.children;
        const linkRegex = /(https?:\/\/[^\s]+)/g;
        const linkParts = [];
        let lastLinkIndex = 0;
        let linkMatch;
        let linkIndex = 0;
        
        while ((linkMatch = linkRegex.exec(text)) !== null) {
          if (linkMatch.index > lastLinkIndex) {
            linkParts.push(text.substring(lastLinkIndex, linkMatch.index));
          }
          linkParts.push(
            <a 
              key={`link-${linkIndex++}`} 
              href={linkMatch[1]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="format-link"
            >
              {linkMatch[1]}
            </a>
          );
          lastLinkIndex = linkMatch.index + linkMatch[0].length;
        }
        
        if (lastLinkIndex < text.length) {
          linkParts.push(text.substring(lastLinkIndex));
        }
        
        if (linkParts.length > 1) {
          return <span key={el.key} className={el.props.className}>{linkParts}</span>;
        }
        return el;
      });
    };
    
    const processedParts = processLinks(parts);
    
    return <>{processedParts}</>;
  };

  // Fetch rooms from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('rooms')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          const formattedRooms: Room[] = data.map(room => ({
            id: room.id,
            name: room.name,
            createdBy: room.created_by
          }));

          setRooms(formattedRooms);

          // Auto-join the first room if no room is selected
          if (!currentRoom && formattedRooms.length > 0) {
            joinRoom(formattedRooms[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast.error('Failed to load chat rooms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [user]);

  // Create a new chat room
  const createRoom = async (name: string): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to create a room");
      return false;
    }

    if (!name || name.trim() === "") {
      toast.error("Room name cannot be empty");
      return false;
    }

    if (rooms.some(room => room.name.toLowerCase() === name.toLowerCase())) {
      toast.error("A room with this name already exists");
      return false;
    }

    try {
      setIsLoading(true);
      
      // Since RLS policies use auth.role(), we'll just use the user.id directly
      // The policy will handle authorization
      const { data, error } = await supabase
        .from('rooms')
        .insert([
          { 
            name, 
            created_by: user.id
          }
        ])
        .select('*')
        .single();

      if (error) {
        console.error("Room creation error:", error);
        throw error;
      }

      if (data) {
        const newRoom: Room = {
          id: data.id,
          name: data.name,
          createdBy: data.created_by
        };

        setRooms(prev => [...prev, newRoom]);
        joinRoom(newRoom.id); // Auto-join the newly created room
        toast.success(`Room "${name}" created successfully!`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Join a specific chat room
  const joinRoom = async (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    try {
      setIsLoading(true);
      setCurrentRoom(room);
      
      // Unsubscribe from previous room channel if exists
      if (channel) {
        await supabase.removeChannel(channel);
      }

      // Fetch messages for the room
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedMessages: Message[] = data.map(message => {
          const formattedContent = formatMessage(message.content);
          return {
            id: message.id,
            roomId: message.room_id,
            content: message.content,
            userId: message.user_id,
            username: message.user_id === user?.id ? user.username : `User-${message.user_id.substring(0, 4)}`,
            timestamp: new Date(message.created_at).getTime(),
            formattedContent: formattedContent || undefined
          };
        });

        setMessages(formattedMessages);
      }

      // Subscribe to real-time updates for this room
      const newChannel = supabase
        .channel(`room-${roomId}`)
        .on('postgres_changes', 
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${roomId}`
          }, 
          (payload) => {
            if (payload.new) {
              const formattedContent = formatMessage(payload.new.content);
              const newMessage: Message = {
                id: payload.new.id,
                roomId: payload.new.room_id,
                content: payload.new.content,
                userId: payload.new.user_id,
                username: payload.new.user_id === user?.id ? user.username : `User-${payload.new.user_id.substring(0, 4)}`,
                timestamp: new Date(payload.new.created_at).getTime(),
                formattedContent: formattedContent || undefined
              };
              
              setMessages(prev => [...prev, newMessage]);
            }
          })
        .subscribe();
      
      setChannel(newChannel);
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error('Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message in the current room
  const sendMessage = async (content: string) => {
    if (!user || !currentRoom) {
      toast.error("You must be logged in and join a room first");
      return;
    }

    if (!content || content.trim() === "") {
      return;
    }

    try {
      // Use the user.id directly with the RLS policy
      const { error } = await supabase
        .from('messages')
        .insert([
          { 
            content, 
            room_id: currentRoom.id, 
            user_id: user.id
          }
        ]);

      if (error) {
        console.error("Message sending error:", error);
        throw error;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [channel]);

  return (
    <ChatContext.Provider 
      value={{ 
        rooms, 
        messages, 
        currentRoom, 
        createRoom, 
        joinRoom, 
        sendMessage,
        formatMessage,
        isLoading
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
