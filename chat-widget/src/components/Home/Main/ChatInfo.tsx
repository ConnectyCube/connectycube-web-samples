import React, { useMemo, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FiUserPlus } from "react-icons/fi";
import { useChat } from "@connectycube/use-chat";
import ConnectyCube from "connectycube";
import GroupMember from "./GroupMember";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/shadcn-ui/dialog";
import NewChatDialog from "../Sidebar/NewChat/NewChatDialog";

export interface ChatInfoProps {
  showProfile: boolean;
  toggleProfile: () => void;
}

const ChatInfo: React.FC<ChatInfoProps> = ({ showProfile, toggleProfile }) => {
  const { selectedDialog, users, getDialogOpponentId, lastActivity } =
    useChat();

  const [addMembersDialogOpen, addMemberDialogOpen] = useState<boolean>(false);

  const opponentId = selectedDialog ? getDialogOpponentId() : null;
  const isGroupChat = selectedDialog?.type === 2;

  const photoUrl = selectedDialog?.photo
    ? ConnectyCube.storage.privateUrl(selectedDialog.photo)
    : undefined;
  const initials = selectedDialog?.name.slice(0, 2).toUpperCase();

  const usersView = useMemo(
    () =>
      selectedDialog?.occupants_ids.map((oId: number) => {
        const user = users[oId];
        return (
          <GroupMember
            userId={user.id}
            name={user.full_name || user.login}
            avatar={user.avatar}
            key={oId}
          />
        );
      }),
    [selectedDialog]
  );

  return (
    <div
      className={`absolute right-0 top-0 h-full z-20 border-l border-gray-200 bg-white transition-transform duration-200 ${
        showProfile ? "translate-x-0 md:w-[350px] w-[100%]" : "translate-x-full"
      }`}
    >
      {/* Profile Header */}
      <div className="flex items-center border-b border-gray-200 py-3 px-4">
        <IoIosArrowBack
          onClick={toggleProfile}
          size={32}
          className="cursor-pointer"
        />
        <span className="mx-auto text-lg font-medium">Profile</span>
      </div>

      {/* Main Profile Info */}
      <div className="h-1/2 w-full relative">
        <div className="w-full h-full relative">
          {/* Avatar */}
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="User Photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-blue-300 text-white text-6xl">
              <span>{initials}</span>
            </div>
          )}

          {/* User Info */}
          <div className="absolute bottom-2 left-5 text-white z-10">
            <p>{selectedDialog?.name || ""}</p>
            {isGroupChat ? (
              <p className="text-sm text-gray-300">
                {selectedDialog.occupants_ids.length} members
              </p>
            ) : (
              <p className="text-sm text-gray-300">
                {opponentId && lastActivity[opponentId as number]}
              </p>
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent"></div>
        </div>
      </div>

      {/* Group Members Section */}
      {isGroupChat && (
        <div className="h-[68%]">
          <div className="flex items-center justify-between p-4">
            <span className="font-medium">Members</span>
            <Dialog
              modal={false}
              open={addMembersDialogOpen}
              onOpenChange={addMemberDialogOpen}
            >
              <DialogTrigger asChild>
                <FiUserPlus className="cursor-pointer" size={28} />
              </DialogTrigger>
              <DialogContent>
                <NewChatDialog
                  chatType={"group"}
                  addUsersMode={true}
                  onFinish={() => addMemberDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="h-full overflow-y-scroll">{usersView}</div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ChatInfo);
