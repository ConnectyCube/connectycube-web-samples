import React, { useMemo } from "react";
import { useConnectyCube } from "@connectycube/react";
import ChatItem from "./ChatItem";

export interface ChatsListProps {
  searchTerm?: string;
}

const ChatsList: React.FC<ChatsListProps> = ({ searchTerm }) => {
  const { dialogs, selectedDialog } = useConnectyCube();

  const dialogsToRender = useMemo(() => {
    return searchTerm
      ? dialogs.filter((d) => {
          return d.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
      : dialogs;
  }, [searchTerm, dialogs, selectedDialog]);

  return dialogsToRender.map((dialog) => {
    return <ChatItem dialog={dialog} key={dialog._id} />;
  });
};

export default ChatsList;
