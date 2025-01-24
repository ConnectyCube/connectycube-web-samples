import React, { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useChat } from "@connectycube/use-chat";
import { DialogHeader, DialogTitle } from "@/components/shadcn-ui/dialog";
import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";
import { Button } from "@/components/shadcn-ui/button";
import { Users } from "node_modules/connectycube/dist/types/types";
import SearchedUser from "./SearchedUser/SearchedUser";
import CreateGroupChat from "./CreateGroupChat/CreateGroupChat";
import Participant from "./CreateGroupChat/Participant/Participant";
import { useNavigate } from "react-router";

export type ChatType = "private" | "group";

export interface NewChatDialogProps {
  chatType: ChatType;
  addUsersMode?: boolean;
  onFinish: () => void;
}

const NewChatDialog: React.FC<NewChatDialogProps> = ({
  chatType,
  addUsersMode,
  onFinish,
}) => {
  const navigate = useNavigate();

  const {
    createChat,
    createGroupChat,
    searchUsers,
    addUsersToGroupChat,
    selectDialog,
    selectedDialog,
  } = useChat();

  const [selectedUsers, setSelectedUsers] = useState<{
    [key: number]: Users.User;
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<Users.User[]>([]);

  const [isCreateGroupChatForm, setIsCreateGroupChatForm] = useState(false);

  const handleSearchUsers = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (searchTerm.length < 4) {
      alert("Min search term is 4 chars");
      return;
    }

    const users = await searchUsers(searchTerm);

    setSearchedUsers(
      addUsersMode
        ? users.filter(
            (user) => !selectedDialog.occupants_ids.includes(user.id)
          )
        : users
    );
  };

  const searchedUsersView: JSX.Element[] = useMemo(() => {
    return searchedUsers.map((user) => {
      return (
        <SearchedUser
          key={user.id}
          id={user.id}
          name={user.full_name || user.login || ""}
          onStartChat={async (userId: number) => {
            const dialog = await createChat(userId);
            await selectDialog(dialog);
            navigate(`/home/${dialog._id}`);
            onFinish();
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
    <>
      <DialogHeader>
        <DialogTitle>
          {addUsersMode ? "Add members" : "Start new chat"}
        </DialogTitle>
        {!isCreateGroupChatForm && (
          <div className="flex-column">
            <form className="flex items-center space-x-2 pt-5">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  placeholder="Enter user name"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="px-3"
                onClick={handleSearchUsers}
              >
                <span className="sr-only">Search</span>
                <FaSearch />
              </Button>
            </form>

            {/* searched users */}
            <div className="mt-10">{searchedUsersView}</div>

            {/* if group chat creation */}
            {chatType === "group" &&
              Object.values(selectedUsers).length > 0 && (
                <>
                  <div className="flex mt-6 gap-2">
                    {Object.values(selectedUsers).map((user) => {
                      return (
                        <Participant
                          key={user.id}
                          avatar={user.avatar}
                          name={user.full_name || user.login || ""}
                        />
                      );
                    })}
                  </div>
                  <div className="text-center">
                    <Button
                      type="button"
                      className="px-3 mt-4 items-center"
                      onClick={async () => {
                        if (addUsersMode) {
                          await addUsersToGroupChat(
                            Object.values(selectedUsers).map((u) => u.id)
                          );
                          onFinish();
                        } else {
                          setIsCreateGroupChatForm(true);
                        }
                      }}
                    >
                      {addUsersMode ? "Add members" : "Create group chat"}
                    </Button>
                  </div>
                </>
              )}
          </div>
        )}

        {isCreateGroupChatForm && (
          <CreateGroupChat
            users={Object.values(selectedUsers)}
            onCreateChat={async (chatName) => {
              const dialog = await createGroupChat(
                Object.values(selectedUsers).map((u) => u.id),
                chatName
              );

              await selectDialog(dialog);
              navigate(`/home/${dialog._id}`);
              onFinish();
            }}
          />
        )}
      </DialogHeader>
    </>
  );
};

export default React.memo(NewChatDialog);
