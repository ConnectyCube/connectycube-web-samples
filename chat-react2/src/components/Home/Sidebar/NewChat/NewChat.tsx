import React, { useMemo, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { useChat } from "@connectycube/use-chat";
import SearchedUser from "./SearchedUser/SearchedUser";
import CreateGroupChat from "./CreateGroupChat/CreateGroupChat";
import Participant from "./CreateGroupChat/Participant/Participant";
import "./NewChat.scss";
import { useNavigate } from "react-router";

export type ChatType = "private" | "group";

export interface NewChatProps {
  onClose: () => void;
  chatType: ChatType;
  addUsers?: boolean;
}

const NewChat: React.FC<NewChatProps> = ({ onClose, chatType, addUsers }) => {
  const navigate = useNavigate();

  const {
    createChat,
    createGroupChat,
    searchUsers,
    addUsersToGroupChat,
    selectDialog,
  } = useChat();

  const [selectedUsers, setSelectedUsers] = useState<{
    [key: number]: Users.User;
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<Users.User[]>([]);

  const [isCreateGroupChat, setIsCreateGroupChat] = useState(false);

  const handleSearchUsers = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (searchTerm.length < 4) {
      alert("Min search term is 4 chars");
      return;
    }

    const users = await searchUsers(searchTerm);

    setSearchedUsers(users);
  };

  const searchedUsersView: JSX.Element[] = useMemo(() => {
    return searchedUsers.map((user) => {
      return (
        <SearchedUser
          key={user.id}
          id={user.id}
          name={user.full_name || user.login}
          onStartChat={async (userId: number) => {
            const dialog = await createChat(userId);
            await selectDialog(dialog);
            navigate(`/home/${dialog._id}`);
            onClose();
          }}
          avatar={user.avatar}
          chatType={chatType}
          isSelected={!!selectedUsers[user.id]}
          onSelectUser={(userId: number, isSelected: boolean) => {
            if (isSelected) {
              setSelectedUsers({ ...selectedUsers, [userId]: user });
            } else {
              delete selectedUsers[userId];
              setSelectedUsers({ ...selectedUsers });
            }
          }}
        />
      );
    });
  }, [searchedUsers, selectedUsers]);

  return (
    <div className="new-chat__container">
      {!isCreateGroupChat && (
        <form
          onSubmit={handleSearchUsers}
          className="new-chat__form"
          action=""
          method="POST"
        >
          <div className="close__btn" onClick={onClose}>
            <AiOutlineClose color="black" fontSize="1.5em" />
          </div>
          <h1>Start new chat</h1>
          <div className="find__user-container">
            <input
              type="text"
              placeholder="Enter user name"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="find__user-btn"
              onClick={handleSearchUsers}
            >
              <FaSearch />
            </button>
          </div>

          <div className="found__users">{searchedUsersView}</div>

          {/* if group chat creation */}
          {chatType === "group" && Object.values(selectedUsers).length > 0 && (
            <>
              <div className="added__users-container">
                {Object.values(selectedUsers).map((user) => {
                  return (
                    <Participant
                      key={user.id}
                      avatar={user.avatar}
                      name={user.full_name || user.login}
                    />
                  );
                })}
              </div>
              <button
                className="create__group-btn"
                onClick={() => {
                  setIsCreateGroupChat(true);
                }}
                type="button"
              >
                Create group chat
              </button>
            </>
          )}

          {/* if add people to group chat */}
          {addUsers && Object.values(selectedUsers).length > 0 && (
            <button
              onClick={() => {
                addUsersToGroupChat(Object.keys(selectedUsers).map(Number));
                onClose();
              }}
              className="add-users__btn"
            >
              Add users
            </button>
          )}
        </form>
      )}

      {isCreateGroupChat && (
        <CreateGroupChat
          onClose={onClose}
          users={Object.values(selectedUsers)}
          onCreateChat={async (chatName) => {
            const dialog = await createGroupChat(
              Object.values(selectedUsers).map((u) => u.id),
              chatName
            );

            await selectDialog(dialog);
            navigate(`/home/${dialog._id}`);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default React.memo(NewChat);
