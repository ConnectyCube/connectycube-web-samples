import React from "react";
import "./Message.scss";
const Message = (props) => {
  const { message } = props;

  //   const date = new Date(message.date_sent * 1000);

  return (
    <div className={`message ${message.senderName === "me" ? "me" : "them"}`}>
      {message.message}
      <span
        className={`message__name ${
          message.senderName === "me" ? "me" : "them"
        }`}
      >
        {message.senderName}
      </span>
    </div>
  );
};

export default Message;
