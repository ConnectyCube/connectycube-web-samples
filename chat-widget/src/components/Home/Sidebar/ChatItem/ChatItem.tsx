import React, { useMemo } from "react";
import { useEffect } from "react";
import { TiGroup } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router";
import { useChat } from "@connectycube/use-chat";
import "./ChatItem.scss";
import Avatar from "../../../Shared/Avatar";
import { Dialogs } from "node_modules/connectycube/dist/types/types";

export interface ChatItemProps {
  dialog: Dialogs.Dialog;
}

const ChatItem: React.FC<ChatItemProps> = ({ dialog }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedDialog,
    selectDialog,
    currentUserId,
    lastMessageSentTimeString,
  } = useChat();

  const isSelected = dialog._id === selectedDialog?._id;

  const lastMessageTime = useMemo(() => {
    return lastMessageSentTimeString(dialog);
  }, [dialog.last_message_date_sent, dialog.created_at]);

  // if open chat page url directly
  useEffect(() => {
    if (location.state === dialog._id && !selectedDialog) {
      selectDialog(dialog);
    }
  }, []);

  const handleSelectChat = async () => {
    await selectDialog(dialog);
    navigate(`/home/${dialog._id}`);
  };

  return (
    <div
      className={`chat__block ${isSelected ? "chosen" : ""}`}
      onClick={handleSelectChat}
    >
      {/* avatar */}
      <Avatar imageUID={dialog.photo} name={dialog.name} />
      
      <div className="user__info-main">
        <div className="group__name-container">
          {dialog.type === 2 && (
            <TiGroup className="group__img" size={26} color="grey" />
          )}
          <p className="chat__username">{dialog.name}</p>
        </div>

        <small className="last__message">
          {dialog.last_message
            ? dialog.last_message_user_id === currentUserId
              ? "me: " + dialog.last_message
              : dialog.name + " : " + dialog.last_message
            : "No messages yet"}
        </small>
        <small>{lastMessageTime}</small>
      </div>

      {/* unread counter */}
      {dialog.unread_messages_count > 0 && (
        <span className="unread-counter">{dialog.unread_messages_count}</span>
      )}
    </div>
  );
};

export default ChatItem;
