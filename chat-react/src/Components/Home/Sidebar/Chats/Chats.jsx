import React from "react";
import "./Chats.scss";
import ConnectyCube from "connectycube";
const Chats = (props) => {
  const { userInfo } = props;

  return (
    <div className="chat__block">
      <div className="user__info">
        <div className="user__img-container">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGTDrhiyiBfgngT17g1Fr0hSgSSnp3UD8cWfDN9ejIN9s3d3I-QaDpe6w8Yb_O2lqMgfE&usqp=CAU"
            alt=""
            className="user__img"
          />
        </div>
      </div>
      <div className="user__info-main">
        <p className="chat__username">{userInfo.name}</p>
        <p className="chat__user-status">Offline</p>
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
