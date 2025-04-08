
import { useAuth } from "../context/AuthContext";
import { ChatProvider } from "../context/ChatContext";
import Login from "../components/Login";
import ChatApp from "../components/ChatApp";

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
};

export default Index;
