import React from "react";
import "./UserInfo.scss";
/* eslint-disable */

import { FiPhoneCall, FiMoreHorizontal } from "react-icons/fi";
import { BsCameraVideo } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { debug } from "connectycube/lib/cubeConfig";
import { useHistory } from "react-router";
import { useState } from "react";
import { useContext } from "react";
import ChatContext from "../../../../services/chat-service";

const UserInfo = (props) => {
  const {
    userInfo,
    typeStatus,
    lastActivity,
    setDialog,
    toggleProfile,
    usersInGroups,
  } = props;
  const context = useContext(ChatContext);
  const [userInfoModal, setUserInfoModal] = useState(false);
  const history = useHistory();
  let opponentId;
  let typersName = [];
  let typingStatus = { isTyping: false };
  if (userInfo.type === 2) {
    userInfo.occupants_ids.filter((e) => {
      if (typeStatus[e]) {
        if (
          typeStatus[e].isTyping &&
          typeStatus[e].dialogId === userInfo._id &&
          e !== parseInt(localStorage.userId)
        ) {
          typersName.push(usersInGroups[e].full_name);
        }
      }
    });
  } else {
    opponentId = userInfo.occupants_ids.find(
      (el) => el !== parseInt(localStorage.userId)
    );
    if (typeStatus[opponentId]) {
      if (
        typeStatus[opponentId].isTyping &&
        typeStatus[opponentId].dialogId === null
      ) {
        typingStatus.isTyping = true;
        typersName.push(opponentId);
      }
    }
  }

  const toggleMore = (close) => {
    if (close) {
      setUserInfoModal(false);
    } else {
      userInfoModal ? setUserInfoModal(false) : setUserInfoModal(true);
    }
  };

  return (
    <div
      className="user__info"
      onMouseLeave={() => {
        toggleMore(true);
      }}
    >
      {userInfoModal && (
        <ul className="more__modal">
          <li
            onClick={() => {
              context.leaveGroupChat(parseInt(localStorage.userId));
              history.push("/home");
            }}
          >
            Exit chat
          </li>
        </ul>
      )}
      <div className="user__info-main">
        <IoIosArrowBack
          size={32}
          onClick={() => {
            history.push("/home");
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
            {typingStatus && userInfo.type === 3 ? (
              typingStatus.isTyping ? (
                "typing..."
              ) : userInfo.type === 3 ? (
                <span className="last__activity">
                  {lastActivity[opponentId]}
                </span>
              ) : (
                "ATAL TYPE 1"
              )
            ) : userInfo.type === 3 ? (
              <span className="last__activity">{lastActivity[opponentId]}</span>
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
        <div
          onClick={() => {
            toggleMore(false);
          }}
          className="button__more"
        >
          <FiMoreHorizontal fontSize={25} />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
