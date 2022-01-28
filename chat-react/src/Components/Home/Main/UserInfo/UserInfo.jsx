import React from "react";
import "./UserInfo.scss";
/* eslint-disable */

import { FiPhoneCall, FiMoreHorizontal } from "react-icons/fi";
import { BsCameraVideo } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
const UserInfo = (props) => {
  const { userInfo, typeStatus, lastActivity, setDialog, toggleProfile } =
    props;
  let opponentId = userInfo.occupants_ids.find(
    (el) => el !== parseInt(localStorage.userId)
  );

  let typingStatus = typeStatus[opponentId];
  return (
    <div className="user__info">
      <div className="user__info-main">
        <IoIosArrowBack
          size={32}
          onClick={() => {
            setDialog("close");
          }}
          className="user__info-back"
        />
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
          <span
            onClick={() => {
              toggleProfile();
            }}
          >
            {userInfo.name}
          </span>

          <div className="typing-status">
            {typingStatus ? (
              typingStatus.isTyping ? (
                "typing..."
              ) : (
                <span className="last__activity">{lastActivity}</span>
              )
            ) : (
              <span className="last__activity">{lastActivity}</span>
            )}
          </div>
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
