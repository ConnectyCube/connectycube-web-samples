import React, { useEffect, useState } from "react";
import Chats from "./Chats/Chats";
import "./Sidebar.scss";
import NewChat from "./NewChat/NewChat";
import { Virtuoso } from "react-virtuoso";

const Sidebar = (props) => {
  const idRef = React.createRef();
  const { dialogs, connect, getChats, setDialog, chosenDialog } = props;
  const [newChatForm, setNewChatForm] = useState(false);
  useEffect(() => {
    connect({
      userId: localStorage.userId,
      password: JSON.parse(localStorage.token),
    });
    //eslint-disable-next-line
  }, []);

  const newChatOpen = () => {
    setNewChatForm(true);
  };
  const newChatClose = () => {
    setNewChatForm(false);
  };
  let chats;

  //   if (dialogs) {
  //     chats = dialogs.map((s) => {
  //       return (

  //       );
  //     });
  //   }

  return (
    <div className="sidebar__container">
      <div className="sidebar__header sidebar-header">
        <div className="sidebar-header__button">
          <div></div>
        </div>
        <div className="sidebar-user__info">
          <span className="sidebar-user__name">{localStorage.login}</span>
          <div className="sidebar-img__container">
            <img
              src="https://www.pixsy.com/wp-content/uploads/2021/04/ben-sweet-2LowviVHZ-E-unsplash-1.jpeg"
              alt=""
            />
          </div>
        </div>
      </div>
      <div onClick={newChatOpen} className="sidebar-add__newchat">
        Start new chat
      </div>
      <div className="sidebar-search__container"></div>
      {newChatForm && <NewChat getChats={getChats} close={newChatClose} />}

      <input
        ref={idRef}
        type="text"
        className="sidebar-search__chat"
        placeholder="Search chats"
      ></input>
      {dialogs && (
        <div className="sidebar-chats__container">
          <Virtuoso
            data={dialogs}
            onLoad={() => {
              console.warn("LOADING CHATS");
            }}
            itemContent={(index, data) => {
              console.log(index);
              return (
                <Chats
                  userInfo={data}
                  setDialog={setDialog}
                  chosenDialog={chosenDialog}
                />
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
