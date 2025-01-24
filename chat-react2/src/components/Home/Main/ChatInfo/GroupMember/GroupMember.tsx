import React from "react";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import "./GroupMember.scss";
import { useChat } from "@connectycube/use-chat";
import { ConfirmationAlert } from "@/components/Shared/ConfirmationAlert";

export interface GroupMemberProps {
  userId: number;
  name: string;
  avatar?: string;
}

const GroupMember: React.FC<GroupMemberProps> = ({ userId, name, avatar }) => {
  const {
    lastActivity,
    selectedDialog,
    currentUserId,
    removeUsersFromGroupChat,
  } = useChat();

  const handleRemoveUser = () => {
    removeUsersFromGroupChat([userId]);
  };

  const initials = name.slice(0, 2);

  const isChatOwner = selectedDialog.user_id === currentUserId;
  const isAdmin = selectedDialog.user_id === userId;
  const canRemoveUser = isChatOwner && currentUserId !== userId;

  const lastActivityInfo = userId !== currentUserId ? lastActivity[userId] : "";

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
          <ConfirmationAlert
            triggerChild={
              <MdPersonRemoveAlt1
                className="remove__user"
                color={"#747474"}
                size={24}
              />
            }
            title="Remove members"
            body="Are you sure you want to remove members?"
            onConfirm={handleRemoveUser}
          />
        )}
        {isAdmin && <span>admin</span>}
      </div>
    </div>
  );
};

export default React.memo(GroupMember);
