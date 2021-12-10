import React from "react";
import Chats from "./Chats/Chats";
import "./Sidebar.scss";
const Sidebar = () => {
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
      <div className="sidebar-add__newchat">NEW CHAT</div>
      <input
        type="text"
        className="sidebar-search__chat"
        placeholder="Search chats"
      />
      <div className="sidebar-chats__container">
        <Chats />
      </div>
    </div>
  );
};

export default Sidebar;
