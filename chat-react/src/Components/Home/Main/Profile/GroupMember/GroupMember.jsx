import React from "react";
import "./GroupMember.scss";

const GroupMember = (props) => {
  const { userInfo, lastActivity } = props;
  return (
    <div className="member">
      <div className="member__photo-container">
        {userInfo.avatar ? (
          <img
            className="member__avatar-img"
            src={userInfo.avatar}
            alt="User avatar"
          />
        ) : (
          <div id="background" className="user__no-img">
            <span className="name">
              {userInfo.full_name
                ? userInfo.full_name.slice(0, 2)
                : userInfo.login.slice(0, 2)}
            </span>
          </div>
        )}
      </div>
      <p>{userInfo.full_name ? userInfo.full_name : userInfo.login}</p>
      <p className="last__activity">{lastActivity}</p>
    </div>
  );
};

export default GroupMember;
