import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import GroupMember from "./GroupMember/GroupMember";
import "./Profile.scss";
/* eslint-disable */

const Profile = (props) => {
  const {
    showProfile,
    userInfo,
    lastActivity,

    toggleProfile,
    usersInGroups,
  } = props;
  let allUsers = [];
  if (userInfo) {
    allUsers = userInfo.occupants_ids.map((e) => {
      if (usersInGroups[e]) {
        return (
          <GroupMember
            userInfo={usersInGroups[e]}
            lastActivity={lastActivity}
          />
        );
      }
    });
  }

  return (
    <div className={`profile__info ${showProfile ? "show" : ""}`}>
      <div className="profile__header">
        <IoIosArrowBack
          onClick={() => {
            toggleProfile();
          }}
          size={32}
        />
        <span>Profile</span>
      </div>
      <div className="profile__main-info">
        {userInfo && (
          <div className="profile__img-container">
            {userInfo.photo ? (
              <img
                className="user__avatar-img"
                src={userInfo.photo}
                alt="User Photo"
              />
            ) : (
              <div id="background" className="user__no-img profile">
                <span className="name">{userInfo.name.slice(0, 2)}</span>
              </div>
            )}
            <div className="profile__user-info">
              <p>{userInfo.name ? userInfo.name : "Unknown"}</p>
              <p className="last__activity">{lastActivity}</p>
              {userInfo.type === 2 && (
                <p className="members__count">
                  {userInfo.occupants_ids.length} members
                </p>
              )}
            </div>
            {userInfo.type === 2 && (
              <div className="profile__group-members">
                <span className="group-members__title">Members</span>
                <div className="members__container">{allUsers}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
