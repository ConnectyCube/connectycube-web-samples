import React from "react";
import "./Message.scss";
const Message = (props) => {
  const { message } = props;
  return (
    <div
      className={`message ${message.userName === "me" ? "me" : "them"}`}
     
    >
      {message.message}
      <span className={`message__name ${message.userName === "me" ? "me" : "them"}`}>{message.userName}</span>
    </div>
  );
};

export default Message;
