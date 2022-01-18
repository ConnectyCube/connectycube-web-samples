import React, { useState } from "react";
import "./NewChat.scss";
import ConnectyCube from "connectycube";
import { AiOutlineClose } from "react-icons/ai";
import { useRef } from "react";
import { FaSearch } from "react-icons/fa";
import FoundUser from "./FoundUser/FoundUser";
import CreateGroupChat from "./CreateGroupChat/CreateGroupChat";
import { BsBoxArrowInUpLeft } from "react-icons/bs";
const NewChat = (props) => {
  const { close, getChats, type, startGroupChat, startChat, searchUsers } =
    props;
  const userRef = React.createRef();

  const [create, setCreate] = useState(false);

  const [foundedUsers, setFoundedUsers] = useState([]);
  let groupOccupants = useRef([]);

  const [occupants, setOccupants] = useState([]);
  const groupChatUsers = (e, id) => {
    if (e) {
      groupOccupants.current.push(id);
      setOccupants(groupOccupants.current.length);
    } else {
      groupOccupants.current = groupOccupants.current.filter((el) => {
        return el !== id;
      });
      setOccupants(groupOccupants.current.length);
    }
    console.log(groupOccupants.current);
  };

  const finding = (e) => {
    e.preventDefault();
    searchUsers(userRef.current.value)
      .then((users) => {
        let allUsers = [];
        setFoundedUsers(() => {
          debugger;
          let array = users.map((user) => {
            let alreadyRendered = allUsers.find((e) => e === user.id);
            if (!alreadyRendered) {
              allUsers.push(user.id);
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
            <button
              className="create__group-btn"
              onClick={() => {
                setCreate(true);
                //  startGroupChat(groupOccupants.current);
              }}
              type="button"
            >
              Create group chat
            </button>
          )}
        </form>
      )}
      {create && (
        <CreateGroupChat
          close={close}
          startGroupChat={startGroupChat}
          occupants={groupOccupants.current}
        />
      )}
    </div>
  );
};

export default NewChat;
