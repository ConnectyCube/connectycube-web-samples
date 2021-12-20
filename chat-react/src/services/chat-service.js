import ConnectyCube from "connectycube";
import { chat } from "connectycube/lib/cubeConfig";
import { createContext, useRef, useState } from "react";
// import { isiOS } from "./heplers";
//import sound from "../sounds/notification_sound.mp3";

const ChatContext = createContext();
export default ChatContext;

export const ChatProvider = ({ children }) => {
  const chatsRef = useRef();
  const [dialogs, setDialogs] = useState();

  const connectToChat = (chatCredentials) => {
    const filters = {};
    ConnectyCube.chat.dialog
      .list(filters)
      .then((result) => {
        chatsRef.current = result.items;
        setDialogs([...chatsRef.current]);
      })
      .catch((error) => {
        console.log(error);
      });
    ConnectyCube.chat
      .connect({
        userId: parseInt(chatCredentials.userId),
        password: chatCredentials.password.token,
      })
      .then(() => {
        console.log("Connected", `chatConnection`);
      })
      .catch((error) => {
        console.log(`Failed connection due to ${error}`);
      });
  };

  const getChats = () => {};

  return (
    <ChatContext.Provider
      value={{
        connectToChat,
        getChats,
        dialogs,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
