import React, { useMemo, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useChat } from "@connectycube/use-chat";
import Participant from "./Participant/Participant";
import groupChatImage from "../../../../../assets/group-chat.jpg";
import "./CreateGroupChat.scss";

export interface CreateGroupChatProps {
  onClose: () => void;
  users: Users.User[];
}

const CreateGroupChat: React.FC<CreateGroupChatProps> = ({
  onClose,
  users,
}) => {
  const { createGroupChat } = useChat();

  const [chatName, setChatName] = useState("");

  const participants = useMemo(() => {
    return users.map((user) => {
      return (
        <Participant name={user.login || user.full_name} avatar={user.avatar} />
      );
    });
  }, [users]);

  const handleCreateChat = () => {
    onClose();

    createGroupChat(
      users.map((u) => u.id),
      chatName
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCreateChat();
      }}
      className="new-chat__form create"
      action="#"
      method="POST"
    >
      <div className="chat__img">
        <img src={groupChatImage} alt="" />
      </div>

      <input
        className="chat__name"
        type="text"
        placeholder="Chat name"
        onChange={(e) => setChatName(e.target.value)}
      />
      <button
        className="create__group-btn"
        onClick={handleCreateChat}
        type="button"
      >
        Create group chat
      </button>
      <div className="close__btn" onClick={onClose}>
        <AiOutlineClose color="black" fontSize="1.5em" />
      </div>
      <div className="users__in-group">{participants}</div>
    </form>
  );
};

export default React.memo(CreateGroupChat);
