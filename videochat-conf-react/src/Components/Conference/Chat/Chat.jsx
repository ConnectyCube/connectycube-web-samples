import React, { createRef } from "react";
import "./Chat.scss";
import ConnectyCube from "connectycube";
const Chat = (props) => {
  debugger;
  const messageRef = createRef();
  const messageArea = (e) => {
    e.currentTarget.style.height = "1px";
    let newHeight = 10 + e.currentTarget.scrollHeight;
    if (newHeight < 300) {
      e.currentTarget.style.height = newHeight + "px";
    } else {
      e.currentTarget.style.height = 200 + "px";
    }
  };

  const sendMessage = () => {
    const message = {
      type: "groupchat",
      body: messageRef.current.value,
      extension: {
        save_to_history: 1,
        dialog_id: props.dialog,
      },
      markable: 1,
    };
    ConnectyCube.chat.send(props.dialog, message);
  };

  return (
    <div className="chat__container">
      <form action="#" className="chat__form">
        <div className="area__container">
          <textarea
            className="message__area"
            name="Message"
            id="message__area"
            ref={messageRef}
            onChange={messageArea}
            placeholder="Enter your message"
          ></textarea>
          <button
            className="send__messsage-btn"
            type="button"
            onClick={sendMessage}
          ></button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
