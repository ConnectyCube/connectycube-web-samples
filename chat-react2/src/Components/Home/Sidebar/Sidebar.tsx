import React, { useContext, useEffect, useState, useMemo } from "react";
import Chats from "./Chats/Chats";
import "./Sidebar.scss";
import NewChat from "./NewChat/NewChat";
import { BsPencil } from "react-icons/bs";
import Auth from "../../../services/auth-service";
import { useNavigate } from "react-router";
import ChatContext from "../../../services/chat-service";

const Sidebar = () => {
  const {
    dialogs,
    connectToChat,
    disconnectFromChat,
    connectStatus,
    getChats,
    setDialog,
    chosenDialog,
    startGroupChat,
    startChat,
    searchUsers,
    lastActivity,
  } = useContext(ChatContext);

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState();
  const [newChatForm, setNewChatForm] = useState(false);
  const createModalRef = React.createRef();
  const [chatType, setChatType] = useState();
  const createChatRef = React.createRef();

  useEffect(() => {
    if (localStorage.token) {
      connectToChat({
        userId: localStorage.userId,
        password: localStorage.token,
      });
    }
  }, []);

  const chats = useMemo(() => {
    if (searchTerm) {
      return dialogs?.map((dialog) => {
        const name = dialog.name.toLowerCase();
        const includesSearchTerm = name.includes(searchTerm.toLowerCase());
        if (includesSearchTerm) {
          return (
            <Chats
              userInfo={dialog}
              setDialog={setDialog}
              chosenDialog={chosenDialog}
              dialogs={dialogs}
              lastActivity={lastActivity}
              key={dialog._id}
            />
          );
        } else {
          return null;
        }
      });
    } else {
      return dialogs?.map((dialog) => {
        return (
          <Chats
            userInfo={dialog}
            setDialog={setDialog}
            chosenDialog={chosenDialog}
            dialogs={dialogs}
            lastActivity={lastActivity}
            key={dialog._id}
          />
        );
      });
    }
  }, [dialogs, searchTerm]);

  const contextMenuRef = React.createRef();

  const newChatOpen = () => {
    let modal = createModalRef.current;
    modal.classList.toggle("hide");
    setNewChatForm(true);
    setChatType(1);
  };

  const groupChat = () => {
    let modal = createModalRef.current;
    modal.classList.toggle("hide");
    setNewChatForm(true);
    setChatType(2);
  };

  const newChatClose = () => {
    setNewChatForm(false);
  };

  const creatingChatChose = (e) => {
    let modal = createModalRef.current;
    modal.classList.toggle("hide");
  };

  const closeModals = (e) => {
    e.stopPropagation();
    let modal = createModalRef.current;
    modal.classList.add("hide");
  };

  const toggleContextMenuHeader = (leave) => {
    if (leave === "leave") {
      contextMenuRef.current.classList.add("hide");
    } else {
      contextMenuRef.current.classList.toggle("hide");
    }
  };

  return (
    <div
      className={`sidebar__container ${chosenDialog ? "" : "show"}`}
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
            <li
              onClick={() => {
                Auth.logout()
                  .then(() => {
                    navigate("/login");
                    disconnectFromChat();
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }}
            >
              Logout
            </li>
          </ul>
        </div>
      </div>

      {newChatForm && (
        <NewChat
          getChats={getChats}
          close={newChatClose}
          type={chatType}
          startGroupChat={startGroupChat}
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
      {dialogs && connectStatus && (
        <div className="sidebar-chats__container">{chats}</div>
      )}
      {!connectStatus && <div className="loader">Loading...</div>}
      <div
        ref={createChatRef}
        onClick={creatingChatChose}
        className="sidebar-add__newchat"
      >
        <BsPencil size={24} color="white" />
      </div>
      <div ref={createModalRef} className="chat-create-menu hide">
        <ul>
          <li onClick={groupChat}>New group</li>
          <li onClick={newChatOpen}>New message</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
