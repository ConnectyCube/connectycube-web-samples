import React from "react";
import { getTime } from "../../../../services/helpers";
import { IoCheckmarkSharp, IoCheckmarkDoneSharp } from "react-icons/io5";
import { useInView } from "react-intersection-observer";
import { useContext } from "react";
import ChatContext from "../../../../services/chat-service";
import "./Message.scss";

const Message = (props) => {
  const [ref, inView] = useInView();
  const { message, dialogInfo, sender } = props;
  const time = getTime(message.date_sent);
  const noName = "NoName";
  const context = useContext(ChatContext);
  if (inView) {
    const params = {
      messageId: message._id,
      userId: message.sender_id,
      dialogId: message.chat_dialog_id,
    };

    if (
      message.read === 0 &&
      message.sender_id !== parseInt(localStorage.userId)
    ) {
      context.readMessage(params);
    }
  }

  const senderName =
    message.sender_id === parseInt(localStorage.userId)
      ? "You"
      : dialogInfo.type === 2
      ? sender
        ? sender.full_name || sender.login
        : noName
      : dialogInfo.name;

  const senderNameNoImage = (senderName.full_name || senderName.login)?.slice(
    0,
    2
  );

  return (
    <div
      ref={ref}
      className={`message ${
        message.sender_id === parseInt(localStorage.userId) ? "my" : "opponent"
      } ${inView ? "view" : "no"}`}
    >
      {dialogInfo.type === 2 && (
        <div className="user__img-container">
          {sender ? (
            sender.avatar ? (
              <img src={`${sender.avatar}`} />
            ) : (
              <div className="user-no-img">{senderNameNoImage}</div>
            )
          ) : (
            <div className="user-no-img">{noName.slice(0, 2)}</div>
          )}
        </div>
      )}
      <div className="user-message__info">
        <span className="message-user__name">{senderName}</span>
        <div>
          {message.message ? (
            message.message
          ) : message.body ? (
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
                  message.loading ? "loading" : "loaded"
                }`}
                className="message__photo"
                src={message.fileUrl}
              />
              {message.loading && (
                <div class="lds-spinner">
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
          <span className="message__time">{time}</span>
          {message.sender_id === parseInt(localStorage.userId) && (
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
