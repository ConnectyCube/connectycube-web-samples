import React from "react";
import "./Chats.scss";
import ConnectyCube from "connectycube";
const Chats = (props) => {
  const { userInfo, setDialog, chosenDialog } = props;
  try {
    if (userInfo._id === chosenDialog._id) {
    }
  } catch {}

  const retrieveChat = () => {
    setDialog(userInfo);
  };
  return (
    <div className="chat__block" onClick={retrieveChat}>
      <div className="user__info">
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
