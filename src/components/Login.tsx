
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-chat-secondary to-white">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-chat-primary">
            Welcome to Chat App
          </CardTitle>
          <CardDescription className="text-center">
            Enter a username to start chatting
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-lg"
                  autoFocus
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-chat-primary hover:bg-opacity-90">
              Join Chat
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
