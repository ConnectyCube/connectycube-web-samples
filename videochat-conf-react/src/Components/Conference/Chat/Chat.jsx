import React, { createRef, useEffect } from "react";
import "./Chat.scss";
import Message from "./Message/Message";
// import { sendMessage } from "../../../services/chat-service";

const Chat = (props) => {
  const { messages, chatHide, chat, dialog, participants } = props;

  useEffect(() => {
    chat.setParticipants(participants);
    chat.getMessages(dialog);
    // eslint-disable-next-line
  }, [messages]);
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
  const messagesContainerRef = React.createRef();

  useEffect(() => {
    let elem = messagesContainerRef;
    elem.current.scrollTop = elem.current.scrollHeight;
  });

  for (let i = 0; i < chat.sortedMessages.length; i += 1) {
    allMessages.push(<Message message={chat.sortedMessages[i]} />);
  }

  const onSendMessage = () => {
    if (messageRef.current.value) {
      chat.sendMessage(messageRef.current.value, props.dialog);

      messageRef.current.value = "";
    }
  };

  const myFormRef = createRef();

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      if (messageRef.current.value !== "") {
        chat.sendMessage(messageRef.current.value, props.dialog);
        messageRef.current.value = "";
      }
    }
  };

  return (
    <div className="chat__container">
      <div onClick={chatHide} className="close__btn"></div>

      <div className="chat__content">
        <div
          id="messages__container"
          ref={messagesContainerRef}
          className="messages__container"
        >
          {allMessages}
        </div>

        <form ref={myFormRef} action="#" className="chat__form">
          <div className="area__container">
            <textarea
              className="message__area"
              name="Message"
              id="message__area"
              ref={messageRef}
              onChange={messageArea}
              onKeyDown={onEnterPress}
              required={true}
              placeholder="Enter your message"
            ></textarea>
            <button
              className="send__messsage-btn"
              type="button"
              onClick={onSendMessage}
            ></button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
