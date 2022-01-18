import React from "react";
import "./Chats.scss";
import { useEffect } from "react";
import { getTime } from "../../../../services/helpers";

const Chats = (props) => {
  const chatRef = React.createRef();
  const { userInfo, setDialog, chosenDialog } = props;
  useEffect(() => {
    try {
      if (userInfo._id === chosenDialog._id) {
        chatRef.current.classList.add("chosen");
      } else {
        chatRef.current.classList.remove("chosen");
      }
    } catch {}
  }, [chosenDialog]);

  const retrieveChat = () => {
    setDialog(userInfo);
  };
  return (
    <div className="chat__block" onClick={retrieveChat} ref={chatRef}>
      <div className="user__info-chats">
        <div className="user__img-container">
          {userInfo.photo && (
            <img alt="" className="user__img" src={userInfo.photo} />
          )}
          {!userInfo.photo && (
            <div id="background" className="user__no-img">
              <span className="name">{userInfo.name.slice(0, 2)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="user__info-main">
        <p className="chat__username">{userInfo.name}</p>
        <small>
          {userInfo.last_message
            ? userInfo.last_message_user_id === parseInt(localStorage.userId)
              ? "me: " + userInfo.last_message
              : userInfo.name + " : " + userInfo.last_message
            : "No messages yet"}
        </small>
        <small>
          {userInfo.last_message
            ? getTime(userInfo.last_message_date_sent)
            : getTime(userInfo.created_at)}
        </small>
        {/* <p className="chat__user-status">Offline</p> */}
      </div>
      {userInfo.unread_messages_count > 0 && (
        <span className="not__read">{userInfo.unread_messages_count}</span>
      )}
      {/* <span className="last__mesage-time">14:30</span> */}
    </div>
  );
};

export default Chats;
