import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FiUserPlus } from "react-icons/fi";
import GroupMember from "./GroupMember/GroupMember";
import NewChat from "../../Sidebar/NewChat/NewChat";
import "./Profile.scss";

const Profile = (props) => {
  const {
    showProfile,
    userInfo,
    lastActivity,
    chosenDialog,
    toggleProfile,
    usersInGroups,
    searchUsers,
  } = props;
  const [addUsers, setAddUsers] = useState(false);
  const close = () => {
    setAddUsers(false);
  };
  let allUsers = [];
  let opponentId;

  if (userInfo) {
    opponentId = userInfo.occupants_ids.find((id) => {
      return id !== parseInt(localStorage.userId);
    });

    allUsers = userInfo.occupants_ids.map((e, index) => {
      return (
        <GroupMember
          userInfo={usersInGroups[e]}
          chosenDialog={chosenDialog}
          lastActivity={lastActivity}
          key={index}
        />
      );
    });
  }

  return (
    <div className={`profile__info ${showProfile ? "show" : ""}`}>
      {addUsers && (
        <NewChat searchUsers={searchUsers} addUsers={true} close={close} />
      )}
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
              {userInfo.type !== 2 && (
                <p className="last__activity">{lastActivity[opponentId]}</p>
              )}

              {userInfo.type === 2 && (
                <p className="members__count">
                  {userInfo.occupants_ids.length} members
                </p>
              )}
            </div>
            {userInfo.type === 2 && (
              <div className="profile__group-members">
                <div className="group__members-header">
                  <span className="group-members__title"> Members</span>

                  <FiUserPlus
                    onClick={() => {
                      setAddUsers(true);
                    }}
                    className="group__members-add"
                    size={32}
                  />
                </div>
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
