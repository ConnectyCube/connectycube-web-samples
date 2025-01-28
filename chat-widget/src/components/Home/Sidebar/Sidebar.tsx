import { useEffect, useState } from "react";
import { BsPencil } from "react-icons/bs";
// import { useNavigate } from "react-router";
import { useChat } from "@connectycube/use-chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/shadcn-ui/dialog";
import NewChatDialog, { ChatType } from "./NewChat/NewChatDialog";
import { currentUser, destroyUserSession } from "../../../connectycube";
import "./Sidebar.scss";
import ChatsList from "./ChatsList/ChatsList";

const Sidebar = () => {
  // const navigate = useNavigate();
  const { isConnected, disconnect, selectedDialog, getDialogs } = useChat();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [chatType, setChatType] = useState<ChatType>("private");
  const [newChatDialogOpen, setNewChatDialogOpen] = useState<boolean>(false);

  // retrieve chats
  useEffect(() => {
    getDialogs();
  }, []);

  const handleLogout = async () => {
    disconnect();
    await destroyUserSession();
    // navigate("/login");
  };

  const handleNewMessage = () => {
    setChatType("private");
  };

  const handleCreateGroupChat = () => {
    setChatType("group");
  };

  return (
    <div className={`sidebar__container ${selectedDialog ? "" : "show"}`}>
      <div className="sidebar__header sidebar-header">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="sidebar-user__info">
            <span className="sidebar-user__name">{currentUser()?.login}</span>
            <div className="sidebar-img__container">
              <div id="background" className="user__no-img main">
                <span className="name">{currentUser()?.login?.slice(0, 2)}</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
    </div>
  );
};

export default Sidebar;
