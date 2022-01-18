import React from "react";
import "./Message.scss";
import { getTime } from "../../../../services/helpers";
const Message = (props) => {
  const { message, dialogInfo, usersInGroups } = props;

  const time = getTime(message.date_sent);
  
  return (
    <div
      className={`message ${
        message.sender_id === parseInt(localStorage.userId) ? "my" : "opponent"
      }`}
    >
      <div className="user__img-container">
        <img
          className="user__img"
          alt="user photo"
          src={
            message.sender_id !== parseInt(localStorage.userId)
              ? dialogInfo.photo
              : ""
          }
        />
      </div>
      <div className="user-message__info">
        <span className="message-user__name">
          {message.sender_id === parseInt(localStorage.userId)
            ? "You"
            : dialogInfo.type === 2
            ? usersInGroups[message.sender_id].login
            : dialogInfo.name}
        </span>
        <p>{message.message ? message.message : message.body}</p>
        <span className="message__time">{time}</span>
      </div>
    </div>
  );
};

export default Message;
