import React from "react";
import ConnectyCube from "connectycube";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-ui/avatar";
import { Button } from "@/components/shadcn-ui/button";
import { ChatType } from "../NewChat";

export interface SearchedUserProps {
  id: number;
  name: string;
  avatar: string | null;
  chatType: ChatType;
  onStartChat: (userId: number) => void;
  isSelected: boolean;
  onSelectUser: (userId: number, isSelected: boolean) => void;
}

const SearchedUser: React.FC<SearchedUserProps> = ({
  id,
  name,
  avatar,
  onStartChat,
  chatType,
  isSelected,
  onSelectUser,
}) => {
  const avatarUrl = avatar
    ? ConnectyCube.storage.privateUrl(avatar)
    : undefined;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className={`flex items-center justify-between relative pb-2`} key={id}>
      <div className="flex items-center flex-[0_0_70%]">
        <Avatar className="w-12 h-12 mr-4">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="text-left">
          <p className="text-black">{name}</p>
        </div>
      </div>
      {chatType === "private" ? (
        <Button
          type="button"
          className="px-3 mt-4"
          onClick={() => {
            onStartChat(id);
          }}
        >
          Start chat
        </Button>
      ) : (
        <div
          className={`border px-4 py-2 rounded-lg transition duration-200 cursor-pointer bg-transparent text-blue-600 border-blue-400 hover:bg-blue-400 hover:text-white`}
          onClick={() => {
            onSelectUser(id, !isSelected);
          }}
        >
          {isSelected ? "Delete" : "Select"}
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchedUser);
