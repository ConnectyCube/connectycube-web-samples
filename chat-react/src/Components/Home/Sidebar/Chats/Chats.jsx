import React from "react";
import "./Chats.scss";
import { useEffect } from "react";
import { createRef } from "react";
import { debug } from "connectycube/lib/cubeConfig";
const Chats = (props) => {
  const chatRef = React.createRef();

  const { userInfo, setDialog, chosenDialog } = props;
  debugger;
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
        {/* <p className="chat__user-status">Offline</p> */}
      </div>
      <span>
        {userInfo.unread_messages_count > 0
          ? userInfo.unread_messages_count
          : ""}
      </span>
      {/* <span className="last__mesage-time">14:30</span> */}
    </div>
  );
};

export default Chats;
