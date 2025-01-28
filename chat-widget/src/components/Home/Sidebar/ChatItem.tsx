import React, { useMemo } from "react";
import { useEffect } from "react";
import { TiGroup } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router";
import { useChat } from "@connectycube/use-chat";
import Avatar from "@/components/Shared/Avatar";
import { Dialogs } from "@connectycube/types";

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
      className={`flex items-center px-5 py-2 cursor-pointer ${
        isSelected
          ? "bg-gray-100 border-l-4 border-blue-500"
          : "hover:bg-gray-100"
      } transition duration-100`}
      onClick={handleSelectChat}
    >
      <Avatar
        imageUID={dialog.photo || ""}
        name={dialog.name}
        className="w-[60px] h-[60px]"
      />

      <div className="flex flex-col flex-1 text-black pl-3 space-y-1 overflow-hidden">
        {/* Group or Username */}
        <div className="flex">
          {dialog.type === 2 && (
            <TiGroup className="pr-2" size={26} color="grey" />
          )}
          <p className="font-medium">{dialog.name}</p>
        </div>

        {/* Last message */}
        <p className="block text-sm text-gray-500 truncate text-left">
          {dialog.last_message
            ? dialog.last_message_user_id === currentUserId
              ? "me: " + dialog.last_message
              : dialog.name + " : " + dialog.last_message
            : "No messages yet"}
        </p>

        {/* Last message time */}
        <p className="text-xs text-gray-400 text-left">{lastMessageTime}</p>
      </div>

      {/* Unread messages counter */}
      {dialog.unread_messages_count > 0 && (
        <span className="bg-blue-400 text-white px-3 py-1 rounded-full text-sm ml-2">
          {dialog.unread_messages_count}
        </span>
      )}
    </div>
  );
};

export default ChatItem;
