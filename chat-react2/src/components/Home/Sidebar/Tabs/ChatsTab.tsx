import { useChat } from "@connectycube/use-chat";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/shadcn-ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { BsPencil } from "react-icons/bs";
import NewChatDialog, { ChatType } from "../NewChat/NewChatDialog";
import ChatsList from "../ChatsList/ChatsList";
import { useState } from "react";

export interface ChatsTabProps {}

const ChatsTab: React.FC<ChatsTabProps> = ({}) => {
  const { isConnected } = useChat();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [chatType, setChatType] = useState<ChatType>("private");
  const [newChatDialogOpen, setNewChatDialogOpen] = useState<boolean>(false);

  const handleNewMessage = () => {
    setChatType("private");
  };

  const handleCreateGroupChat = () => {
    setChatType("group");
  };

  return (
    <>
      <input
        type="text"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        className="sidebar-search__chat"
        placeholder="Search..."
      ></input>
      {isConnected ? (
        <div className="sidebar-chats__container">
          <ChatsList searchTerm={searchTerm} />
        </div>
      ) : (
        <div className="loader">Loading...</div>
      )}
      <Dialog
        modal={false}
        open={newChatDialogOpen}
        onOpenChange={setNewChatDialogOpen}
      >
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="sidebar-add__newchat">
            <BsPencil size={34} color="white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={handleCreateGroupChat}>
                New group
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={handleNewMessage}>
                New message
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <NewChatDialog
            chatType={chatType}
            onFinish={() => {
              setNewChatDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatsTab;
