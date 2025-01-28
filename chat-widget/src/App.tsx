import { useLayoutEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { MessageCircleMore } from "lucide-react"
import ConnectyCube from "connectycube";
import { ChatProvider } from "@connectycube/use-chat";
import { Button } from "@/components/shadcn-ui/button"
import Home from "./components/Home/Home";
import { tryRestoreSession } from "./connectycube";
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

const App: React.FC<AppProps> = ({ 
  appId,
  authKey,
  config,
  buttonStyle,
  portalStyle,
  buttonClassName,
  portalClassName
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useLayoutEffect(() => {
    ConnectyCube.init({appId, authKey}, config);
    tryRestoreSession();
  }, []);

  return (
    <>
      <Button
        style={{ ...buttonStyle }}
        className={[buttonClassName, 'chat-widget-button'].join(' ')}
        onClick={toggleChat}>
        <MessageCircleMore /> Chat
      </Button>
      {isOpen && ReactDOM.createPortal(
        <div
          style={{ ...portalStyle }}
          className={[portalClassName, 'chat-widget-portal'].join(' ')}>
          <ChatProvider>
            <Home />
          </ChatProvider>
        </div>,
        document.body
      )}
    </>
  );
}

export default App;
