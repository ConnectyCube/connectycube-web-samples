import React, { useContext } from "react";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import ChatContext from "../../../../../services/chat-service";
import "./GroupMember.scss";

const GroupMember = (props) => {
  const { userInfo, lastActivity, chosenDialog } = props;

  const context = useContext(ChatContext);

  const onRemoveUser = () => {
    context.removeUser(userInfo.id);
  };

  const userName = userInfo.full_name || userInfo.login;

  const userInitial =
    userInfo.full_name?.slice(0, 2) || userInfo.login.slice(0, 2);

  const lastActivityInfo =
    userInfo.id !== parseInt(localStorage.userId)
      ? lastActivity[userInfo.id]
      : "";

  const isChatOwner = chosenDialog.user_id === parseInt(localStorage.userId);

  const canRemoveUser =
    isChatOwner && userInfo.id !== parseInt(localStorage.userId);

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
            <span className="name">{userInitial}</span>
          </div>
        )}
      </div>
      <div className="member__info-container">
        <div className="member__name-activity">
          <p>{userName}</p>
          <p className="last__activity">{lastActivityInfo}</p>
        </div>

        {canRemoveUser && (
          <div className="remove__user-container" onClick={onRemoveUser}>
            <MdPersonRemoveAlt1
              className="remove__user"
              color={"#747474"}
              size={28}
            />
          </div>
        )}
        {userInfo.id === chosenDialog.user_id && <span>admin</span>}
      </div>
    </div>
  );
};

export default GroupMember;
