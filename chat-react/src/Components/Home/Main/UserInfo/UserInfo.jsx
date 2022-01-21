import React from "react";
import "./UserInfo.scss";
import { FiPhoneCall, FiMoreHorizontal } from "react-icons/fi";
import { BsCameraVideo } from "react-icons/bs";
const UserInfo = (props) => {
  const { userInfo, typeStatus } = props;
  let opponentId = userInfo.occupants_ids.find(
    (el) => el !== parseInt(localStorage.userId)
  );

  let typingStatus = typeStatus[opponentId];
  return (
    <div className="user__info">
      <div className="user__info-main">
        <div className="user__avatar-dialog">
          {userInfo.photo ? (
            <img
              className="user__avatar-img"
              src={userInfo.photo}
              alt="User Photo"
            />
          ) : (
            <div id="background" className="user__no-img">
              <span className="name">{userInfo.name.slice(0, 2)}</span>
            </div>
          )}
        </div>
        <div className="user-name-container">
          <span>{userInfo.name}</span>
          <span className="typing-status">
            {typingStatus ? (typingStatus.isTyping ? "typing..." : "") : ""}
          </span>
        </div>
      </div>
      <div className="user__info-buttons">
        <div className="button__more">
          <FiMoreHorizontal fontSize={25} />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
