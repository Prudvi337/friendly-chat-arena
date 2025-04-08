
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

type AuthUser = {
  username: string;
  id: string;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (username: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Check for existing session on component mount
  useEffect(() => {
    // For now, just simulate a simple authentication system
    // In a real app, this would be replaced with Supabase auth
    const savedUser = localStorage.getItem("chatUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // This anonymous login is a workaround to make RLS work with our simple auth
        // Only do this in development for demo purposes
        setTimeout(async () => {
          try {
            await supabase.auth.signInAnonymously();
          } catch (error) {
            console.error("Anonymous login failed:", error);
          }
        }, 0);
      } catch (error) {
        localStorage.removeItem("chatUser");
      }
    }
  }, []);

  // In a real application, this would validate against a server
  const login = (username: string) => {
    // Basic validation
    if (!username || username.trim() === "") {
      toast.error("Username cannot be empty");
      return false;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return false;
    }

    // In a real app, we'd check with the server if username is already in use
    const userId = `user_${Date.now().toString(36)}`;
    const newUser = { username, id: userId };
    setUser(newUser);
    localStorage.setItem("chatUser", JSON.stringify(newUser));
    
    // This anonymous login is a workaround to make RLS work with our simple auth
    // Only do this in development for demo purposes
    setTimeout(async () => {
      try {
        await supabase.auth.signInAnonymously();
        toast.success("Login successful!");
      } catch (error) {
        console.error("Anonymous login failed:", error);
        toast.error("Login error occurred");
      }
    }, 0);
    
    return true;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("chatUser");
    
    // Sign out from Supabase too
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
