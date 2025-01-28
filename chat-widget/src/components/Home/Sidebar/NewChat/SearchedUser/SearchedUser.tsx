import React from "react";
import ConnectyCube from "connectycube";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-ui/avatar";
import { Button } from "@/components/shadcn-ui/button";
import { ChatType } from "../NewChatDialog";
import "./SearchedUser.scss";

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
    <div
      className={`found__user ${isSelected ? "checked" : "not-checked"}`}
      key={id}
    >
      <div className="user__main-info">
        <Avatar className="user__avatar">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="user__name-info">
          <p className="user__full-name">{name}</p>
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
          className={`add-status ${isSelected ? "delete" : "add"}`}
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
