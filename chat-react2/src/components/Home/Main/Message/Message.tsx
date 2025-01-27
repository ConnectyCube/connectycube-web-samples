import React, { useMemo } from "react";
import { IoCheckmarkSharp, IoCheckmarkDoneSharp } from "react-icons/io5";
import { useInView } from "react-intersection-observer";
import { Messages } from "node_modules/connectycube/dist/types/types";
import { useChat } from "@connectycube/use-chat";
import Avatar from "../../../Shared/Avatar";
import "./Message.scss";

export interface MessageProps {
  message: Messages.Message;
  isGroupChat: boolean;
  dialogName: string;
  senderName: string;
  senderAvatar: string;
}

const Message: React.FC<MessageProps> = ({
  message,
  isGroupChat,
  dialogName,
  senderName,
  senderAvatar,
}) => {
  const { currentUserId, readMessage, messageSentTimeString } = useChat();

  const isCurrentUserSender = message.sender_id === currentUserId;

  const senderNameString = isCurrentUserSender
    ? "You"
    : isGroupChat
    ? senderName
    : dialogName;

  const sentTime = useMemo(() => {
    return messageSentTimeString(message);
  }, [message.date_sent]);

  const [ref, inView] = useInView();
  if (inView) {
    if (message.read === 0 && message.sender_id !== currentUserId) {
      readMessage(message._id, message.sender_id, message.chat_dialog_id);
    }
  }

  return (
    <div
      ref={ref}
      className={`message ${isCurrentUserSender ? "my" : "opponent"} ${
        inView ? "view" : "no"
      }`}
    >
      {/* avatar */}
      {isGroupChat && !isCurrentUserSender && (
        <Avatar name={senderName} imageUID={senderAvatar} />
      )}

      <div className="user-message__info">
        {/* sender name in group chat */}
        {isGroupChat && !isCurrentUserSender && (
          <span className="message-user__name">{senderNameString}</span>
        )}
        {/* message body */}
        <div>
          {message.message ? (
            message.message
          ) : (
            <div
              className="message__photo-container"
              onClick={(e) => {
                e.currentTarget.classList.toggle("full");
              }}
            >
              <img
                classList={`message__img ${
                  message.isLoading ? "loading" : "loaded"
                }`}
                className="message__photo"
                src={message.fileUrl}
              />
              {message.isLoading && (
                <div className="lds-spinner">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="message__time-container">
          {/* date sent */}
          <span className="message__time">{sentTime}</span>

          {/* sent/read status */}
          {isCurrentUserSender && (
            <span className="message__status">
              {message.read ? (
                <IoCheckmarkDoneSharp size={14} color="#727272" />
              ) : (
                <IoCheckmarkSharp size={14} color="#727272" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
