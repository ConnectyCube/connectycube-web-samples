import React from "react";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import { useChat } from "@connectycube/use-chat";
import { ConfirmationAlert } from "@/components/Shared/ConfirmationAlert";
import Avatar from "@/components/Shared/Avatar";

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

  const isChatOwner = selectedDialog.user_id === currentUserId;
  const isAdmin = selectedDialog.user_id === userId;
  const canRemoveUser = isChatOwner && currentUserId !== userId;

  const lastActivityInfo = userId !== currentUserId ? lastActivity[userId] : "";

  return (
    <div className="flex items-center p-2 gap-2">
      <Avatar imageUID={avatar} name={name} className="w-[60px] h-[60px]" />
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start">
          <p className="text-black font-medium">{name}</p>
          <p className="text-gray-500 text-sm">{lastActivityInfo}</p>
        </div>
        {canRemoveUser && (
          <ConfirmationAlert
            triggerChild={
              <MdPersonRemoveAlt1
                className="cursor-pointer"
                color={"#747474"}
                size={24}
              />
            }
            title="Remove members"
            body="Are you sure you want to remove members?"
            onConfirm={handleRemoveUser}
          />
        )}
        {isAdmin && <span className="text-blue-600 font-bold ml-2">Admin</span>}
      </div>
    </div>
  );
};

export default React.memo(GroupMember);
