import { useRef, useState } from "react";
import { BsPencil } from "react-icons/bs";
import { useNavigate } from "react-router";
import { useChat } from "@connectycube/use-chat";
import ChatsList from "./ChatsList/ChatsList";
import NewChat from "./NewChat/NewChat";
import { destroyUserSession } from "../../../connectycube";
import "./Sidebar.scss";

const Sidebar = () => {
  const navigate = useNavigate();
  const { dialogs, isConnected, disconnect, selectedDialog } = useChat();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newChatFormVisible, setNewChatFormVisible] = useState(false);
  const [chatType, setChatType] = useState<number>();

  const createChatRef = useRef<HTMLDivElement | null>(null);
  const createModalRef = useRef<HTMLDivElement | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    disconnect();
    await destroyUserSession();
    navigate("/login");
  };

  const handleNewMessage = () => {
    createModalRef.current?.classList.toggle("hide");
    setNewChatFormVisible(true);
    setChatType(1);
  };

  const handleCreateGroupChat = () => {
    createModalRef.current?.classList.toggle("hide");
    setNewChatFormVisible(true);
    setChatType(2);
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

  const toggleContextMenuHeader = (leave?: string) => {
    if (leave === "leave") {
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
          toggleContextMenuHeader("leave");
        }}
      >
        <div
          className="sidebar-user__info"
          onClick={() => {
            toggleContextMenuHeader();
          }}
        >
          <span className="sidebar-user__name">{localStorage.login}</span>
          <div className="sidebar-img__container">
            <div id="background" className="user__no-img main">
              <span className="name">{localStorage.login?.slice(0, 2)}</span>
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
        <NewChat
          getChats={getChats}
          onClose={closeNewChatForm}
          type={chatType}
          startChat={startChat}
          searchUsers={searchUsers}
        />
      )}

      <input
        type="text"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        className="sidebar-search__chat"
        placeholder="Search..."
      ></input>
      {dialogs && isConnected() && (
        <div className="sidebar-chats__container">
          <ChatsList searchTerm={searchTerm} />
        </div>
      )}
      {!isConnected() && <div className="loader">Loading...</div>}
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
