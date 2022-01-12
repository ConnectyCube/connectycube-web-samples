import React from "react";
import "./UserInfo.scss";
import { FiPhoneCall, FiMoreHorizontal } from "react-icons/fi";
import { BsCameraVideo } from "react-icons/bs";
const UserInfo = (props) => {
  const { userInfo } = props;
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
        <span>{userInfo.name}</span>
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
