import React from "react";
import "./Message.scss";
const Message = (props) => {
  const { message, dialogInfo } = props;
  return (
    <div
      className={`message ${
        message.sender_id === parseInt(localStorage.userId) ? "my" : "opponent"
      }`}
    >
      <div className="user__img-container">
        <img
          className="user__img"
          src={
            message.sender_id !== parseInt(localStorage.userId)
              ? dialogInfo.photo
              : ""
          }
        />
      </div>
      <span className="message-user__name">
        {message.sender_id === parseInt(localStorage.userId)
          ? "You"
          : dialogInfo.name}
      </span>
      <p>{message.message ? message.message : message.body}</p>
      <span>{}</span>
    </div>
  );
};

export default Message;
