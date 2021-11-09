import React, { createRef } from "react";
import "./Chat.scss";
import ConnectyCube from "connectycube";
import Message from "./Message/Message";
const Chat = (props) => {
  const { messages } = props;
  const messageRef = createRef();
  const messageArea = (e) => {
    e.currentTarget.style.height = "1px";
    let newHeight = 10 + e.currentTarget.scrollHeight;
    if (newHeight < 160) {
      e.currentTarget.style.height = newHeight + "px";
    } else {
      e.currentTarget.style.height = 160 + "px";
    }
  };
  let allMessages = [];

  for (let i = 0; i < messages.length; i += 1) {
    allMessages.push(
		 <Message message= {messages[i]}/>
    );
  }

  const sendMessage = () => {
    const message = {
      type: "groupchat",
      body: messageRef.current.value,
      extension: {
        save_to_history: 1,
      },
    };

    ConnectyCube.chat.send(props.dialog.current, message);
  };

  return (
    <div className="chat__container">
      <div className="messages__container">{allMessages}</div>

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
