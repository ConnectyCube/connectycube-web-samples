import React, { useEffect, useState } from "react";
import Chats from "./Chats/Chats";
import "./Sidebar.scss";
import ConnectyCube from "connectycube";
import react from "react";
import { debug } from "connectycube/lib/cubeConfig";
import NewChat from "./NewChat/NewChat";
const Sidebar = (props) => {
  const idRef = React.createRef();
  const { dialogs, connect } = props;
  const [newChatForm, setNewChatForm] = useState(false);
  useEffect(() => {
    connect({
      userId: localStorage.userId,
      password: JSON.parse(localStorage.token),
    });
  }, []);

  const newChatOpen = () => {
    setNewChatForm(true);
  };
  const newChatClose = () => {
    setNewChatForm(false);
  };
  let chats;
  if (dialogs) {
    chats = dialogs.map((s) => {
      return <Chats userInfo={s} />;
    });
  }

  return (
    <div className="sidebar__container">
      <div className="sidebar__header sidebar-header">
        <div className="sidebar-header__button">
          <div></div>
        </div>
        <div className="sidebar-user__info">
          <span className="sidebar-user__name">UserName</span>
          <div className="sidebar-img__container">
            <img
              src="https://www.pixsy.com/wp-content/uploads/2021/04/ben-sweet-2LowviVHZ-E-unsplash-1.jpeg"
              alt=""
            />
          </div>
        </div>
      </div>
      <div onClick={newChatOpen} className="sidebar-add__newchat">
        NEW CHAT
      </div>
      <div className="sidebar-search__container"></div>
      {newChatForm && <NewChat close={newChatClose} />}

      <input
        ref={idRef}
        type="text"
        className="sidebar-search__chat"
        placeholder="Search chats"
      ></input>
      <div className="sidebar-chats__container">{chats}</div>
    </div>
  );
};

export default Sidebar;
