import React from "react";
import "./Message.scss";
const Message = (props) => {
  const { message, dialogInfo } = props;
  debugger;

  return (
    <div
      className={`message ${
        message.sender_id === parseInt(localStorage.userId) ? "my" : "opponent"
      }`}
    >
      <span className="message-user__name">
        {message.sender_id === parseInt(localStorage.userId)
          ? "You"
          : dialogInfo.name}
      </span>
      {message.message}
    </div>
  );
};

export default Message;
