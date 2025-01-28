import { useLayoutEffect, useState, StrictMode } from "react";
import ReactDOM from 'react-dom';
import { MessageCircleMore } from "lucide-react"
import ConnectyCube from "connectycube";
import { ChatProvider } from "@connectycube/use-chat";
import { BrowserRouter } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router";
import { Button } from "@/components/shadcn-ui/button";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import Home from "@/components/Home/Home";
import { tryRestoreSession, isSessionExists } from "./connectycube";
import { Config } from "@connectycube/types";

import "./App.css";

type AppProps = {
  appId: Config.Credentials["appId"];
  authKey: Config.Credentials["authKey"];
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
        className={[buttonClassName, 'chat-widget-button'].join(' ')}
        onClick={toggleChat}>
        <MessageCircleMore /> Chat
      </Button>
      {isOpen && ReactDOM.createPortal(
        <div  style={{ ...portalStyle }} className={[portalClassName, 'chat-widget-portal'].join(' ')}>
          <div className="flex flex-col items-center justify-center w-full h-full text-center bg-gray-800 text-black overflow-hidden absolute">
            <ChatProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Navigate to={initialPath} />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
                  <Route path="/home/:id" element={<ProtectedRoute element={<Home />} />} />
                </Routes>
              </BrowserRouter>
            </ChatProvider>
          </div>
        </div> ,
        document.body
      )}
    </StrictMode>
  );
}

export default App;
