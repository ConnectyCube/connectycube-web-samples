import React, { useEffect, useState } from "react";
import Chats from "./Chats/Chats";
import "./Sidebar.scss";
import NewChat from "./NewChat/NewChat";
import { BsPencil } from "react-icons/bs";
import Auth from "../../../services/auth-service";
import { useHistory } from "react-router";

const Sidebar = (props) => {
  const [searching, setSearching] = useState(false);
  const [searchFor, setSearchFor] = useState();
  const {
    dialogs,
    connect,
    getChats,
    setDialog,
    chosenDialog,
    startGroupChat,
    startChat,
    searchUsers,
  } = props;

  const [newChatForm, setNewChatForm] = useState(false);
  const createModalRef = React.createRef();
  const [chatType, setChatType] = useState();
  const createChatRef = React.createRef();
  useEffect(() => {
    if (localStorage.token) {
      connect({
        userId: localStorage.userId,
        password: JSON.parse(localStorage.token),
      });
    }

    //eslint-disable-next-line
  }, []);

  const history = useHistory();
  const chatsRender = (dialogs, search) => {
    if (search) {
      chats = dialogs.map((dialog) => {
        let name = dialog.name.toLowerCase();
        let filter = name.includes(search.toLowerCase());
        if (filter) {
          return (
            <Chats
              userInfo={dialog}
              setDialog={setDialog}
              chosenDialog={chosenDialog}
            />
          );
        }
        return;
      });
    } else {
      chats = dialogs.map((dialog) => {
        return (
          <Chats
            userInfo={dialog}
            setDialog={setDialog}
            chosenDialog={chosenDialog}
          />
        );
      });
    }
  };

  let chats;

  if (dialogs) {
    if (searching) {
      chatsRender(dialogs, searchFor);
    } else {
      chatsRender(dialogs);
    }
  }

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

  return (
    <div className="sidebar__container" onMouseLeave={closeModals}>
      <div className="sidebar__header sidebar-header">
        {/* <div className="sidebar-header__button">
          <div></div>
        </div> */}
        <div className="sidebar-user__info">
          <span className="sidebar-user__name">{localStorage.login}</span>
          <div
            className="sidebar-img__container"
            onClick={() => {
              document.getElementById("context__menu").classList.toggle("hide");
            }}
          >
            <img
              src="https://www.pixsy.com/wp-content/uploads/2021/04/ben-sweet-2LowviVHZ-E-unsplash-1.jpeg"
              alt=""
            />
          </div>
        </div>
        <div id="context__menu" className="context__menu hide modal">
          <ul>
            <li
              onClick={() => {
                Auth.logout()
                  .then(() => {
                    history.go("/login");
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
          if (e.target.value) {
            setSearchFor(e.target.value);
            setSearching(true);
          } else {
            setSearching(false);
          }
        }}
        className="sidebar-search__chat"
        placeholder="Search..."
      ></input>
      {dialogs && <div className="sidebar-chats__container">{chats}</div>}
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
