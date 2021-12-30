import React, { useState } from "react";
import "./NewChat.scss";
import ConnectyCube from "connectycube";
import { AiOutlineClose } from "react-icons/ai";

import { FaSearch } from "react-icons/fa";
import FoundUser from "./FoundUser/FoundUser";
const NewChat = (props) => {
  const { close, getChats } = props;
  const userRef = React.createRef();

  const [foundedUsers, setFoundedUsers] = useState([]);

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
            return <FoundUser close={close} getChats={getChats} userInfo={e} />;
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
    <form onSubmit={finding} className="new-chat__form" action="" method="POST">
      <div className="close__btn" onClick={close}>
        <AiOutlineClose color="white" fontSize="1.5em" />
      </div>
      <h1>Start new chat</h1>
      <div className="find__user-container">
        <input ref={userRef} type="text" placeholder="Enter user name" />
        <button type="button" className="find__user-btn" onClick={finding}>
          <FaSearch />
        </button>
      </div>

      <div className="found__users">{foundedUsers}</div>
    </form>
  );
};

export default NewChat;
