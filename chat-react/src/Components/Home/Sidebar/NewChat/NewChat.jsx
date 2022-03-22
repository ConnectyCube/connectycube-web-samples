import React, { useContext, useState } from "react";
import "./NewChat.scss";
/* eslint-disable */
import ConnectyCube from "connectycube";
import { AiOutlineClose } from "react-icons/ai";
import { useRef } from "react";
import { FaSearch } from "react-icons/fa";
import FoundUser from "./FoundUser/FoundUser";
import CreateGroupChat from "./CreateGroupChat/CreateGroupChat";
import { BsBoxArrowInUpLeft } from "react-icons/bs";
import ChatContext from "../../../../services/chat-service";
import UserInGroup from "./CreateGroupChat/UserInGroup/UserInGroup";
const NewChat = (props) => {
  const {
    close,
    getChats,
    type,
    startGroupChat,
    startChat,
    searchUsers,
    addUsers,
  } = props;
  const context = useContext(ChatContext);
  const userRef = React.createRef();

  const [create, setCreate] = useState(false);
  let usersInGroup = [];
  const [foundedUsers, setFoundedUsers] = useState([]);
  let groupOccupants = useRef([]);

  const [occupants, setOccupants] = useState([]);
  const groupChatUsers = (e, userInfo) => {
    if (e) {
      groupOccupants.current.push(userInfo);
      setOccupants(groupOccupants.current.length);
    } else {
      groupOccupants.current = groupOccupants.current.filter((el) => {
        return el.id !== userInfo.id;
      });
      setOccupants(groupOccupants.current.length);
    }
    console.log(groupOccupants.current);
  };

  usersInGroup = groupOccupants.current.map((user) => {
    return <UserInGroup user={user} />;
  });

  const finding = (e) => {
    e.preventDefault();
    searchUsers(userRef.current.value)
      .then((users) => {
        let allUsers = [];
        let userFiltered = users.filter(
          (ele, ind) => ind === users.findIndex((elem) => elem.id === ele.id)
        );
        setFoundedUsers(() => {
          let array = userFiltered.map((user) => {
            allUsers.push(user.id);
            if (user.id !== parseInt(localStorage.userId)) {
              return (
                <FoundUser
                  startChat={startChat}
                  close={close}
                  getChats={getChats}
                  userInfo={user}
                  type={type}
                  groupChatUsers={groupChatUsers}
                  groupOccupants={groupOccupants.current}
                />
              );
            }
          });
          return array;
        });
      })
      .catch((error) => {
        console.log(error);
        alert("NOT FETCHED");
      });
  };

  return (
    <div className="new-chat__container">
      {!create && (
        <form
          onSubmit={finding}
          className="new-chat__form"
          action=""
          method="POST"
        >
          <div className="close__btn" onClick={close}>
            <AiOutlineClose color="black" fontSize="1.5em" />
          </div>
          <h1>Start new chat</h1>
          <div className="find__user-container">
            <input ref={userRef} type="text" placeholder="Enter user name" />
            <button type="button" className="find__user-btn" onClick={finding}>
              <FaSearch />
            </button>
          </div>

          <div className="found__users">{foundedUsers}</div>
          {type === 2 && occupants > 0 && (
            <div className="added__users-container">{usersInGroup}</div>
          )}
          {type === 2 && occupants > 0 && (
            <button
              className="create__group-btn"
              onClick={() => {
                setCreate(true);
              }}
              type="button"
            >
              Create group chat
            </button>
          )}
          {addUsers && occupants > 0 && (
            <button
              onClick={() => {
                let users = [];
                groupOccupants.current.forEach((user) => {
                  users.push(user.id);
                });
                context.addUsersToGroup(users);
                close();
              }}
              className="add-users__btn"
            >
              Add users
            </button>
          )}
        </form>
      )}

      {create && (
        <CreateGroupChat
          close={close}
          startGroupChat={startGroupChat}
          groupOccupants={groupOccupants.current}
        />
      )}
    </div>
  );
};

export default NewChat;
