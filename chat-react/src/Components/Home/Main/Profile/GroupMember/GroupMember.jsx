import React, { useContext } from "react";
import "./GroupMember.scss";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import ConnectyCube from "connectycube";
import ChatContext from "../../../../../services/chat-service";
const GroupMember = (props) => {
  const { userInfo, lastActivity, chosenDialog } = props;
  const context = useContext(ChatContext);
  const onRemoveUser = () => {
    context.removeUser(userInfo.id);
  };
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
      <div className="member__info-container">
        <p>{userInfo.full_name ? userInfo.full_name : userInfo.login}</p>

        {userInfo.id !== parseInt(localStorage.userId) &&
          chosenDialog.user_id === parseInt(localStorage.userId) && (
            <div className="remove__user-container">
              <MdPersonRemoveAlt1
                className="remove__user"
                color={"#747474"}
                size={28}
                onClick={onRemoveUser}
              />
            </div>
          )}
        {userInfo.id === parseInt(localStorage.userId) && <span>admin</span>}
      </div>
      <p className="last__activity">{lastActivity}</p>
    </div>
  );
};

export default GroupMember;
