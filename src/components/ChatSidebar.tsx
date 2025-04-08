
import React, { useState } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { UserCircle, Hash, Plus, LogOut, Loader2 } from "lucide-react";

const ChatSidebar: React.FC = () => {
  const { rooms, currentRoom, joinRoom, createRoom, isLoading } = useChat();
  const { user, logout } = useAuth();
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingRoom(true);
    try {
      const success = await createRoom(newRoomName);
      if (success) {
        setNewRoomName("");
        setIsCreateRoomOpen(false);
      }
    } finally {
      setCreatingRoom(false);
    }
  };

  return (
    <div className="bg-sidebar h-full w-64 flex flex-col text-sidebar-foreground">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Chat Rooms</h2>
      </div>
      <Separator className="bg-sidebar-border" />
      <div className="flex-1 overflow-auto p-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-5 w-5 animate-spin text-sidebar-foreground" />
          </div>
        ) : (
          <div className="space-y-1">
            {rooms.map((room) => (
              <Button
                key={room.id}
                variant="ghost"
                className={`w-full justify-start ${
                  currentRoom?.id === room.id ? "bg-sidebar-accent" : ""
                }`}
                onClick={() => joinRoom(room.id)}
              >
                <Hash className="mr-2 h-4 w-4" />
                <span className="truncate">{room.name}</span>
              </Button>
            ))}
            {rooms.length === 0 && (
              <div className="text-center p-4 text-muted-foreground">
                <p>No rooms available</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Separator className="bg-sidebar-border" />
      <div className="p-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-sidebar-foreground border-sidebar-border bg-sidebar-accent"
          onClick={() => setIsCreateRoomOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Room
        </Button>
      </div>
      <Separator className="bg-sidebar-border" />
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <UserCircle className="h-6 w-6 mr-2" />
          <span className="font-medium truncate">{user?.username}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Create Room Dialog */}
      <Dialog open={isCreateRoomOpen} onOpenChange={setIsCreateRoomOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateRoom}>
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="mt-2"
                autoFocus
                required
              />
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateRoomOpen(false)}
                disabled={creatingRoom}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creatingRoom}>
                {creatingRoom ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatSidebar;
