import React, { useMemo } from "react";
import { useChat } from "@connectycube/use-chat";
import ChatItem from "../ChatItem/ChatItem";
import "./ChatsList.scss";

export interface ChatsListProps {
  searchTerm?: string;
}

const ChatsList: React.FC<ChatsListProps> = ({ searchTerm }) => {
  const { dialogs } = useChat();

  const dialogsToRender = useMemo(() => {
    return searchTerm
      ? dialogs.filter((d) => {
          return d.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
      : dialogs;
  }, [searchTerm]);

  return dialogsToRender.map((dialog) => {
    return <ChatItem dialog={dialog} key={dialog._id} />;
  });
};

export default ChatsList;
