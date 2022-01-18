import React from "react";
import "./CreateGroupChat.scss";
import { AiOutlineClose } from "react-icons/ai";
const CreateGroupChat = (props) => {
  const { occupants, startGroupChat, close } = props;

  const groupNameRef = React.createRef();
  return (
    <form className="new-chat__form create" action="#" method="POST">
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
          startGroupChat(occupants, groupNameRef.current.value);
        }}
        type="button"
      >
        Create group chat
      </button>
      <div className="close__btn" onClick={close}>
        <AiOutlineClose color="black" fontSize="1.5em" />
      </div>
    </form>
  );
};

export default CreateGroupChat;
