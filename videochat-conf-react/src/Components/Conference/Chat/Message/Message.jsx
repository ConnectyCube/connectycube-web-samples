import React from "react";
import "./Message.scss";
const Message = (props) => {
  const { message } = props;
  let timeOfMessage = null;
  try {
    const now = new Date(message.delay.attrs.stamp);
    let d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      0
    );
    timeOfMessage =
      d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
  } catch {
    const now = new Date(message.created_at);
    let d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      0
    );
    timeOfMessage =
      d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
  }

  return (
    <div className={`message ${message.senderName === "me" ? "me" : "them"}`}>
      <span
        className={`message__name ${
          message.senderName === "me" ? "me" : "them"
        }`}
      >
        {message.senderName === "me" ? "" : message.senderName}
      </span>
      <p className={`message__text`}>{message.message}</p>

      <span
        className={`message__time ${
          message.senderName === "me" ? "me" : "them"
        }`}
      >
        {timeOfMessage}
      </span>
    </div>
  );
};

export default Message;
