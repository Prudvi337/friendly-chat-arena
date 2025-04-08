
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";

type ChatMessageProps = {
  id: string;
  content: string;
  username: string;
  userId: string;
  timestamp: number;
  formattedContent?: JSX.Element;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ content, username, userId, timestamp, formattedContent }) => {
  const { user } = useAuth();
  const isCurrentUser = user?.id === userId;
  
  // Format timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarFallback className="bg-chat-primary text-white">
            {username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col">
        {!isCurrentUser && (
          <span className="text-xs text-muted-foreground mb-1">{username}</span>
        )}
        <div className={`message-bubble ${isCurrentUser ? 'message-bubble-user' : 'message-bubble-other'}`}>
          <div className="break-words">
            {formattedContent || content}
          </div>
          <div className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/80' : 'text-secondary-foreground/80'}`}>
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
      {isCurrentUser && (
        <Avatar className="h-8 w-8 ml-2">
          <AvatarFallback className="bg-chat-accent text-white">
            {username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
