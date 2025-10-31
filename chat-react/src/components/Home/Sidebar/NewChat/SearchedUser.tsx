import React from "react";
import { Button } from "@/components/shadcn-ui/button";
import { ChatType } from "../NewChat";
import Avatar from "@/components/shared/Avatar";

export interface SearchedUserProps {
  id: number;
  name: string;
  avatar?: string;
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
    <div className={`flex items-center justify-between relative pb-2`} key={id}>
      <div className="flex items-center flex-[0_0_70%] gap-2">
        <Avatar imageUID={avatar} name={name} className="w-[50px] h-[50px]" />
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
