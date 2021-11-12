import React from "react";
import "./Message.scss";
import "../../../../services/heplers";
import { getTime } from "../../../../services/heplers";
const Message = (props) => {
  const { message } = props;
  let timeOfMessage = null;
  debugger;
  try {
    timeOfMessage = getTime(message.extension.date_sent);
  } catch {
    timeOfMessage = getTime(message.date_sent);
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

      <p
        className={`message__time ${
          message.senderName === "me" ? "me" : "them"
        }`}
      >
        {timeOfMessage}
      </p>
    </div>
  );
};

export default Message;
