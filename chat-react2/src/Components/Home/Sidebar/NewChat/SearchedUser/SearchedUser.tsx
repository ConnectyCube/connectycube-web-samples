import React from "react";
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
  return (
    <div
      className={`found__user ${isSelected ? "checked" : "not-checked"}`}
      key={id}
    >
      <div className="user__main-info">
        <div className="user__avatar">
          <img
            src={
              avatar ||
              "https://s.aficionados.com.br/imagens/frases-sasuke-uchiha-naruto_t.jpg"
            }
            alt="Avatatar"
          />
        </div>
        <div className="user__name-info">
          <p className="user__full-name">{name}</p>
          <span className="user__login">@{name}</span>
        </div>
      </div>
      {chatType === "private" ? (
        <button
          type="button"
          onClick={() => {
            onStartChat(id);
          }}
          className="add__btn"
          fontSize="2em"
          color="white"
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
          {isSelected ? "Delete" : "Add"}
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchedUser);
