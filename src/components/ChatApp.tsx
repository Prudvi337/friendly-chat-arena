
import React from "react";
import ChatSidebar from "./ChatSidebar";
import ChatRoom from "./ChatRoom";

const ChatApp: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar />
      <ChatRoom />
    </div>
  );
};

export default ChatApp;
