import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useRef } from "react";
import { FaSearch } from "react-icons/fa";
import FoundUser from "./FoundUser/FoundUser";
import CreateGroupChat from "./CreateGroupChat/CreateGroupChat";
import "./NewChat.scss";

export interface NewChatProps {
  onClose: () => void;
}

const NewChat: React.FC<NewChatProps> = ({ onClose }) => {
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

  const lookForUsers = async (e) => {
    e.preventDefault();

    if (userRef.current.value.length < 4) {
      alert("Min search term is 4 chars");
      return;
    }

    try {
      const users = await searchUsers(userRef.current.value);

      setFoundedUsers(() => {
        return users.map((user) => {
          return (
            <FoundUser
              key={user.id}
              startChat={startChat}
              close={close}
              getChats={getChats}
              userInfo={user}
              type={type}
              groupChatUsers={groupChatUsers}
              groupOccupants={groupOccupants.current}
            />
          );
        });
      });
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  return (
    <div className="new-chat__container">
      {!create && (
        <form
          onSubmit={lookForUsers}
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
            <button
              type="button"
              className="find__user-btn"
              onClick={lookForUsers}
            >
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
        <CreateGroupChat onClose={onClose} users={groupOccupants.current} />
      )}
    </div>
  );
};

export default NewChat;
