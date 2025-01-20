import { useEffect, useRef, useState } from "react";
import { BsPencil } from "react-icons/bs";
import { useNavigate } from "react-router";
import { useChat } from "@connectycube/use-chat";
import ChatsList from "./ChatsList/ChatsList";
import NewChat, { ChatType } from "./NewChat/NewChat";
import { currentUser, destroyUserSession } from "../../../connectycube";
import "./Sidebar.scss";

const Sidebar = () => {
  const navigate = useNavigate();
  const { dialogs, isConnected, disconnect, selectedDialog, getDialogs } =
    useChat();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newChatFormVisible, setNewChatFormVisible] = useState(false);
  const [chatType, setChatType] = useState<ChatType>("private");

  const createChatRef = useRef<HTMLDivElement | null>(null);
  const createModalRef = useRef<HTMLDivElement | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

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
    createModalRef.current?.classList.toggle("hide");
    setNewChatFormVisible(true);
    setChatType("private");
  };

  const handleCreateGroupChat = () => {
    createModalRef.current?.classList.toggle("hide");
    setNewChatFormVisible(true);
    setChatType("group");
  };

  const closeNewChatForm = () => {
    setNewChatFormVisible(false);
  };

  const creatingChatChose = () => {
    createModalRef.current?.classList.toggle("hide");
  };

  const closeModals = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    createModalRef.current?.classList.add("hide");
  };

  const toggleContextMenu = (hide?: boolean) => {
    if (hide) {
      contextMenuRef.current?.classList.add("hide");
    } else {
      contextMenuRef.current?.classList.toggle("hide");
    }
  };

  return (
    <div
      className={`sidebar__container ${selectedDialog ? "" : "show"}`}
      onMouseLeave={closeModals}
    >
      <div
        className="sidebar__header sidebar-header"
        onMouseLeave={() => {
          toggleContextMenu(true); // hide context menu
        }}
      >
        <div
          className="sidebar-user__info"
          onClick={() => {
            toggleContextMenu(); // show context menu
          }}
        >
          <span className="sidebar-user__name">{currentUser()?.login}</span>
          <div className="sidebar-img__container">
            <div id="background" className="user__no-img main">
              <span className="name">{currentUser()?.login.slice(0, 2)}</span>
            </div>
          </div>
        </div>
        <div
          ref={contextMenuRef}
          id="context__menu"
          className="context__menu hide modal"
        >
          <ul>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
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
      <div
        ref={createChatRef}
        onClick={creatingChatChose}
        className="sidebar-add__newchat"
      >
        <BsPencil size={24} color="white" />
      </div>
      <div ref={createModalRef} className="chat-create-menu hide">
        <ul>
          <li onClick={handleCreateGroupChat}>New group</li>
          <li onClick={handleNewMessage}>New message</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
