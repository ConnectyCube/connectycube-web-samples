import React from "react";
import ConnectyCube from "connectycube";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-ui/avatar";
import { ChatType } from "../NewChat";
import "./SearchedUser.scss";

export interface SearchedUserProps {
  id: number;
  name: string;
  avatar: string;
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
        <button
          type="button"
          onClick={() => {
            onStartChat(id);
          }}
          className="add__btn"
          style={{ fontSize: "2em", color: "white" }}
        >
          Start chat
        </button>
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
