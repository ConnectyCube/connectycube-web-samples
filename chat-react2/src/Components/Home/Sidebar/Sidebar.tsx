import { useEffect, useState } from "react";
import { BsPencil } from "react-icons/bs";
import { useNavigate } from "react-router";
import { useChat } from "@connectycube/use-chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import NewChat, { ChatType } from "./NewChat/NewChat";
import { currentUser, destroyUserSession } from "../../../connectycube";
import "./Sidebar.scss";
import ChatsList from "./ChatsList/ChatsList";

const Sidebar = () => {
  const navigate = useNavigate();
  const { dialogs, isConnected, disconnect, selectedDialog, getDialogs } =
    useChat();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newChatFormVisible, setNewChatFormVisible] = useState(false);
  const [chatType, setChatType] = useState<ChatType>("private");

  // retrieve chats
  useEffect(() => {
    getDialogs();
  }, []);

  const handleLogout = async () => {
    disconnect();
    await destroyUserSession();
    navigate("/login");
  };

  const handleNewMessage = () => {
    setNewChatFormVisible(true);
    setChatType("private");
  };

  const handleCreateGroupChat = () => {
    setNewChatFormVisible(true);
    setChatType("group");
  };

  const closeNewChatForm = () => {
    setNewChatFormVisible(false);
  };

  return (
    <div className={`sidebar__container ${selectedDialog ? "" : "show"}`}>
      <div className="sidebar__header sidebar-header">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="sidebar-user__info">
            <span className="sidebar-user__name">{currentUser()?.login}</span>
            <div className="sidebar-img__container">
              <div id="background" className="user__no-img main">
                <span className="name">{currentUser()?.login.slice(0, 2)}</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {newChatFormVisible && (
        <NewChat onClose={closeNewChatForm} chatType={chatType} />
      )}

      <input
        type="text"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        className="sidebar-search__chat"
        placeholder="Search..."
      ></input>
      {dialogs && isConnected && (
        <div className="sidebar-chats__container">
          <ChatsList searchTerm={searchTerm} />
        </div>
      )}
      {!isConnected && <div className="loader">Loading...</div>}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="sidebar-add__newchat">
          <BsPencil size={34} color="white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleCreateGroupChat}>
            New group
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleNewMessage}>
            New message
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Sidebar;
