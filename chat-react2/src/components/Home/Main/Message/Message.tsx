import React from "react";
import { getTime } from "../../../../services/helpers";
import { IoCheckmarkSharp, IoCheckmarkDoneSharp } from "react-icons/io5";
import { useInView } from "react-intersection-observer";
import { Messages } from "node_modules/connectycube/dist/types/types";

import "./Message.scss";
import { useChat } from "@connectycube/use-chat";

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
  const { currentUserId, readMessage } = useChat();

  const chatName =
    message.sender_id === currentUserId
      ? "You"
      : isGroupChat
      ? senderName
      : dialogName;

  const senderNameNoAvatar = senderName.slice(0, 2);

  const sentTime = getTime(message.date_sent);

  const [ref, inView] = useInView();
  if (inView) {
    if (message.read === 0 && message.sender_id !== currentUserId) {
      readMessage(message._id, message.sender_id, message.chat_dialog_id);
    }
  }

  return (
    <div
      ref={ref}
      className={`message ${
        message.sender_id === currentUserId ? "my" : "opponent"
      } ${inView ? "view" : "no"}`}
    >
      {isGroupChat && (
        <div className="user__img-container">
          senderAvatar ? (
          <img src={senderAvatar} />) : (
          <div className="user-no-img">{senderNameNoAvatar}</div>)
        </div>
      )}
      <div className="user-message__info">
        <span className="message-user__name">{chatName}</span>
        <div>
          {message.body ? (
            message.body
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
          <span className="message__time">{sentTime}</span>
          {message.sender_id === currentUserId && (
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
