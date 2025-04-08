import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import ChatMessage from "./ChatMessage";
import { Send, Bold, Italic, Link2, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const ChatRoom: React.FC = () => {
  const { currentRoom, messages, sendMessage, isLoading } = useChat();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for the current room
  const roomMessages = currentRoom 
    ? messages.filter(message => message.roomId === currentRoom.id)
    : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [roomMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };

  const insertFormatting = (type: string) => {
    let syntax = "";
    let selectionStart = 0;
    let selectionEnd = 0;
    
    switch (type) {
      case "bold":
        syntax = "**bold text**";
        selectionStart = 2;
        selectionEnd = 11;
        break;
      case "italic":
        syntax = "*italic text*";
        selectionStart = 1;
        selectionEnd = 12;
        break;
      case "link":
        syntax = "https://example.com";
        selectionStart = 0;
        selectionEnd = 18;
        break;
    }
    
    setMessageInput(prev => `${prev}${prev && " "}${syntax}`);
    
    // Focus will happen on next tick after state update
    setTimeout(() => {
      const inputElement = document.getElementById("messageInput") as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        const position = inputElement.value.length - syntax.length;
        inputElement.setSelectionRange(
          position + selectionStart, 
          position + selectionEnd
        );
      }
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <h3 className="text-lg font-medium">Loading...</h3>
        </div>
      </div>
    );
  }

  if (!currentRoom) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center text-muted-foreground">
          <h3 className="text-lg font-medium">No room selected</h3>
          <p>Please select a room from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Room header */}
      <div className="p-4 border-b flex items-center">
        <div>
          <h2 className="text-lg font-semibold">#{currentRoom.name}</h2>
          <p className="text-sm text-muted-foreground">
            Welcome to #{currentRoom.name}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-background to-muted/30">
        {roomMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          roomMessages.map((message) => (
            <ChatMessage
              key={message.id}
              id={message.id}
              content={message.content}
              username={message.username}
              userId={message.userId}
              timestamp={message.timestamp}
              formattedContent={message.formattedContent}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex space-x-1 mr-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => insertFormatting("bold")}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bold</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => insertFormatting("italic")}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italic</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => insertFormatting("link")}
                  >
                    <Link2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Link</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Input
            id="messageInput"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!messageInput.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <div className="mt-2 text-xs text-muted-foreground">
          <span>Formatting: </span>
          <span className="font-bold">**bold**</span>
          <span> | </span>
          <span className="italic">*italic*</span>
          <span> | </span>
          <span className="underline">https://link.com</span>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
