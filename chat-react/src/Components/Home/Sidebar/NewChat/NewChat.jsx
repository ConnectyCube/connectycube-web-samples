import React, { useRef, useState } from "react";
import "./NewChat.scss";
import ConnectyCube from "connectycube";
import { AiOutlineClose } from "react-icons/ai";
const NewChat = (props) => {
  const { close } = props;
  const userRef = React.createRef();
  const users = useRef([]);
  const [foundedUsers, setFoundedUsers] = useState([]);
  const findUser = () => {
    return new Promise((resolve, reject) => {
      let login = userRef.current.value;
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
            users.current.push(element.user);
          });

          ConnectyCube.users
            .get(searchLogin)
            .then((result) => {
              users.current.unshift(result.user);
              resolve(users.current);
            })
            .catch((error) => {
              resolve(users.current);
            });
        })
        .catch((error) => {});
    });
  };
  const newChat = () => {
    const params = {
      type: 3,
      //occupants_ids: [idRef.current.value],
    };
    ConnectyCube.chat.dialog
      .create(params)
      .then((dialog) => {})
      .catch((error) => {});
  };
  return (
    <form className="new-chat__form" action="" method="POST">
      <div className="close__btn" onClick={close}>
        <AiOutlineClose color="white" fontSize="1.5em" />
      </div>
      <h1>Start new chat</h1>
      <div className="find__user-container">
        <input
          ref={userRef}
          type="text"
          placeholder="Enter user login to find him"
        />
        <button
          type="button"
          className="find__user-btn"
          onClick={() => {
            findUser()
              .then((users) => {
                setFoundedUsers(() => {
                  let array = users.map((e) => {
                    return (
                      <div className="found__user">
                        <p>{e.full_name}</p>
                        <span>{e.login}</span>
                      </div>
                    );
                  });
                  return array;
                });
              })
              .catch(() => {
                alert("NOT FETCHED");
              });
          }}
        >
          Find user
        </button>
      </div>

      <div className="found__users">{foundedUsers}</div>
    </form>
  );
};

export default NewChat;
