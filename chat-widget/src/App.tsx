import { useLayoutEffect, useState, StrictMode } from "react";
import { MemoryRouter, Navigate, Route, Routes } from "react-router";
import { MessageCircleMore } from "lucide-react"
import ConnectyCube from "connectycube";
import { ChatProvider } from "@connectycube/use-chat";
import { Button } from "@/components/shadcn-ui/button";
import Login from "@/components/login";
import Home from "@/components/home/home";
import { Config } from "@connectycube/types";
import { tryRestoreSession, isSessionExists } from "./connectycube";

type AppProps = {
  appId: Config.Credentials["appId"];
  authKey: Config.Credentials["authKey"];
  userFullName?: string;
  userId?: string;
  config?: Config.Options;
  buttonStyle?: React.CSSProperties;
  portalStyle?: React.CSSProperties;
  buttonClassName?: string;
  portalClassName?: string;
};

function ProtectedRoute({ element }: { element: JSX.Element }) {
  return isSessionExists() ? element : <Navigate to="/login" replace />;
}

const App: React.FC<AppProps> = ({ 
  appId,
  authKey,
  userFullName,
  userId,
  config,
  buttonStyle,
  portalStyle,
  buttonClassName,
  portalClassName
}) => {
  const initialPath = isSessionExists() ? "/home" : "/login";
  const [isOpen, setIsOpen] = useState(false);
  const defaultConfig: Config.Options = {
    chat: {
      streamManagement: {
        enable: true,
      },
    },
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useLayoutEffect(() => {
    ConnectyCube.init({appId, authKey}, Object.assign(defaultConfig, config));
    tryRestoreSession();
  }, []);

  return (
    <StrictMode>
      <Button
        style={{ ...buttonStyle }}
        className={`fixed bottom-4 right-4 bg-blue-500 text-white rounded-lg px-4 py-2 text-lg ${buttonClassName}`}
        onClick={toggleChat}>
        <MessageCircleMore /> Chat
      </Button>
      {isOpen &&
        <div 
          style={{ ...portalStyle }} 
          className={`fixed bottom-16 right-4 w-[720px] h-[640px] border border-gray-300 rounded-lg overflow-hidden shadow-lg flex flex-col items-center justify-center text-center bg-gray-800 text-black ${portalClassName}`}
        >
          <ChatProvider>
            <MemoryRouter>
              <Routes>
                <Route path="/" element={<Navigate to={initialPath} />} />
                <Route path="/login" element={<Login userFullName={userFullName} userId={userId} />} />
                <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
                <Route path="/home/:id" element={<ProtectedRoute element={<Home />} />} />
              </Routes>
            </MemoryRouter>
          </ChatProvider>
        </div>
      }
    </StrictMode>
  );
}

export default App;
