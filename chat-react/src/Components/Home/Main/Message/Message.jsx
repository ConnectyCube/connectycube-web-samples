import React from "react";
import "./Message.scss";
import { getTime } from "../../../../services/helpers";
/* eslint-disable */
import { IoCheckmarkSharp, IoCheckmarkDoneSharp } from "react-icons/io5";
import { useEffect } from "react";

import { useInView } from "react-intersection-observer";
import ConnectyCube from "connectycube";
import { useContext } from "react";
import ChatContext from "../../../../services/chat-service";

const Message = (props) => {
  const [ref, inView] = useInView();
  const { message, dialogInfo, usersInGroups } = props;
  const time = getTime(message.date_sent);
  const noName = "NoName";
  const context = useContext(ChatContext);
  if (inView) {
    console.log(
      "Message in view " + message.message + " read status is " + message.read
    );
    let params = {
      messageId: message._id,
      userId: message.sender_id,
      dialogId: message.chat_dialog_id,
    };

    if (
      message.read === 0 &&
      message.sender_id !== parseInt(localStorage.userId)
    ) {
      debugger;
      context.readMessage(params);
    }
  }

  const weRead = () => {};

  return (
    <div
      ref={ref}
      className={`message ${
        message.sender_id === parseInt(localStorage.userId) ? "my" : "opponent"
      } ${inView ? "view" : "no"}`}
    >
      {inView ? console.log("Message in view" + message.body) : null}
      {dialogInfo.type === 2 && (
        <div className="user__img-container">
          {dialogInfo.type === 2 ? (
            usersInGroups[message.sender_id] ? (
              usersInGroups[message.sender_id].avatar ? (
                <img src={`${usersInGroups[message.sender_id].avatar}`} />
              ) : (
                <div className="user-no-img">
                  {usersInGroups[message.sender_id].full_name.slice(0, 2)}
                </div>
              )
            ) : (
              <div className="user-no-img">{noName.slice(0, 2)}</div>
            )
          ) : (
            ""
          )}
        </div>
      )}
      <div className="user-message__info">
        <span className="message-user__name">
          {message.sender_id === parseInt(localStorage.userId)
            ? "You"
            : dialogInfo.type === 2
            ? usersInGroups[message.sender_id]
              ? usersInGroups[message.sender_id].full_name
                ? usersInGroups[message.sender_id].full_name
                : usersInGroups[message.sender_id].login
              : noName
            : dialogInfo.name}
        </span>
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
