import React from "react";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import "./GroupMember.scss";
import { useChat } from "@connectycube/use-chat";

export interface GroupMemberProps {
  id: number;
  name: string;
  avatar?: string;
}

const GroupMember: React.FC<GroupMemberProps> = ({ id, name, avatar }) => {
  const {
    lastActivity,
    selectedDialog,
    currentUserId,
    removeUsersFromGroupChat,
  } = useChat();

  const handleRemoveUser = () => {
    removeUsersFromGroupChat([id]);
  };

  const initials = name.slice(0, 2);
  const isChatOwner = selectedDialog.user_id === currentUserId;
  const canRemoveUser = isChatOwner && id !== currentUserId;

  const lastActivityInfo = id !== currentUserId ? lastActivity[id] : "";

  return (
    <div className="member">
      <div className="member__photo-container">
        {avatar ? (
          <img className="member__avatar-img" src={avatar} alt="User avatar" />
        ) : (
          <div id="background" className="user__no-img">
            <span className="name">{initials}</span>
          </div>
        )}
      </div>
      <div className="member__info-container">
        <div className="member__name-activity">
          <p>{name}</p>
          <p className="last__activity">{lastActivityInfo}</p>
        </div>

        {canRemoveUser && (
          <div className="remove__user-container" onClick={handleRemoveUser}>
            <MdPersonRemoveAlt1
              className="remove__user"
              color={"#747474"}
              size={28}
            />
          </div>
        )}
        {isChatOwner && <span>admin</span>}
      </div>
    </div>
  );
};

export default React.memo(GroupMember);
