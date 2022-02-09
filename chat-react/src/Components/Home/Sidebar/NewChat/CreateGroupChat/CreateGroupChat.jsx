/* eslint-disable */

import React, { useEffect, useState } from "react";
import "./CreateGroupChat.scss";
import { AiOutlineClose } from "react-icons/ai";
import UserInGroup from "./UserInGroup/UserInGroup";
const CreateGroupChat = (props) => {
  const { groupOccupants, startGroupChat, close } = props;
  const groupNameRef = React.createRef();
  let usersInGroup = [];

  usersInGroup = groupOccupants.map((user) => {
    return <UserInGroup user={user} />;
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        close();
        startGroupChat(groupOccupants, groupNameRef.current.value);
      }}
      className="new-chat__form create"
      action="#"
      method="POST"
    >
      <div className="chat__img">
        <img
          src={`https://wegotthiscovered.com/wp-content/uploads/2021/07/Sasuke-Boruto-670x335.jpg`}
          alt=""
        />
      </div>

      <input
        ref={groupNameRef}
        className="chat__name"
        type="text"
        placeholder="Chat name"
      />
      <button
        className="create__group-btn"
        onClick={() => {
          close();
          startGroupChat(groupOccupants, groupNameRef.current.value);
        }}
        type="button"
      >
        Create group chat
      </button>
      <div className="close__btn" onClick={close}>
        <AiOutlineClose color="black" fontSize="1.5em" />
      </div>
      <div className="users__in-group">{usersInGroup}</div>
    </form>
  );
};

export default CreateGroupChat;
