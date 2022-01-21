import React from "react";
import "./Message.scss";
import { getTime } from "../../../../services/helpers";
const Message = (props) => {
  const { message, dialogInfo, usersInGroups } = props;
  const time = getTime(message.date_sent);
  const myUserId = parseInt(localStorage.userId);
  return (
    <div
      className={`message ${
        message.sender_id === parseInt(localStorage.userId) ? "my" : "opponent"
      }`}
    >
      {dialogInfo.type === 2 && (
        <div className="user__img-container">
          {dialogInfo.type === 2 ? (
            usersInGroups[message.sender_id].avatar ? (
              <img src={`${usersInGroups[message.sender_id].avatar}`} />
            ) : (
              <div className="user-no-img">
                {usersInGroups[message.sender_id].full_name.slice(0, 2)}
              </div>
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
            ? usersInGroups[message.sender_id].full_name
              ? usersInGroups[message.sender_id].full_name
              : usersInGroups[message.sender_id].login
            : dialogInfo.name}
        </span>
        <p>{message.message ? message.message : message.body}</p>
        <span className="message__time">{time}</span>
      </div>
    </div>
  );
};

export default Message;
