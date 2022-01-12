import React, { useState } from "react";
import "./NewChat.scss";
import ConnectyCube from "connectycube";
import { AiOutlineClose } from "react-icons/ai";
import { useRef } from "react";
import { FaSearch } from "react-icons/fa";
import FoundUser from "./FoundUser/FoundUser";
import CreateGroupChat from "./CreateGroupChat/CreateGroupChat";
const NewChat = (props) => {
  const { close, getChats, type, startGroupChat } = props;
  const userRef = React.createRef();

  const [create, setCreate] = useState(false);

  const [foundedUsers, setFoundedUsers] = useState([]);
  let groupOccupants = useRef([]);

  const [occupants, setOccupants] = useState([]);
  const groupChatUsers = (e, id) => {
    if (e.currentTarget.checked) {
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

  const findUser = () => {
    return new Promise((resolve, reject) => {
      const users = [];
      const searchParams = {
        full_name: userRef.current.value,
        per_page: 100,
        page: 1,
      };
      const searchLogin = { login: userRef.current.value };
      ConnectyCube.users
        .get(searchParams)
        .then((result) => {
          result.items.forEach((element) => {
            users.push(element.user);
          });

          ConnectyCube.users
            .get(searchLogin)
            .then((result) => {
              users.unshift(result.user);
              resolve(users);
            })
            .catch((error) => {
              resolve(users);
            });
        })
        .catch((error) => {});
    });
  };

  const finding = (e) => {
    e.preventDefault();

    findUser()
      .then((users) => {
        setFoundedUsers(() => {
          let array = users.map((e) => {
            return (
              <FoundUser
                close={close}
                getChats={getChats}
                userInfo={e}
                type={type}
                groupChatUsers={groupChatUsers}
              />
            );
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
