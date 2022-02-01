import React from "react";
import "./UserInfo.scss";
/* eslint-disable */

import { FiPhoneCall, FiMoreHorizontal } from "react-icons/fi";
import { BsCameraVideo } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { debug } from "connectycube/lib/cubeConfig";

const UserInfo = (props) => {
  const {
    userInfo,
    typeStatus,
    lastActivity,
    setDialog,
    toggleProfile,
    usersInGroups,
  } = props;

  let typersName = [];
  if (userInfo.type === 2) {
    userInfo.occupants_ids.filter((e) => {
      if (typeStatus[e]) {
        debugger;
        if (typeStatus[e].isTyping && typeStatus[e].dialogId === userInfo._id) {
          typersName.push(usersInGroups[e].full_name);
        }
      }
    });
  }

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
              ) : userInfo.type === 3 ? (
                <span className="last__activity">{lastActivity}</span>
              ) : (
                "ATAL TYPE 1"
              )
            ) : userInfo.type === 3 ? (
              <span className="last__activity">{lastActivity}</span>
            ) : (
              ""
            )}
            {userInfo.type === 2 ? (
              <span>
                {typersName.length > 0
                  ? typersName.length > 1
                    ? typersName.toString() + " are typing"
                    : typersName.toString() + " is typing"
                  : ""}
              </span>
            ) : (
              ""
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
