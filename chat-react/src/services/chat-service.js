import ConnectyCube from "connectycube";
import { createContext, useRef, useState } from "react";
// import { isiOS } from "./heplers";
//import sound from "../sounds/notification_sound.mp3";

const ChatContext = createContext();
export default ChatContext;

export const ChatProvider = ({ children }) => {
  const connectToChat = (chatCredentials) => {
    ConnectyCube.chat
      .connect(chatCredentials)
      .then(() => {
        console.log("Connected", `chatConnection`);
      })
      .catch((error) => {
        console.log(`Failed connection due to ${error}`);
      });
  };
  return (
    <ChatContext.Provider
      value={{
        connectToChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
