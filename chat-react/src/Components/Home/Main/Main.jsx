import React from "react";
import "./Main.scss";
import { useEffect, useState } from "react";
import Message from "./Message/Message";
import UserInfo from "./UserInfo/UserInfo";
import { animateScroll } from "react-scroll";

const Main = (props) => {
  const { sendMessage, chosenDialog, getMessages, messages, usersInGroups } =
    props;
  const dialog = chosenDialog;
  const messageRef = React.createRef();
  const messagesRef = React.createRef();
  const [allMessages, setAllMessages] = useState();
  useEffect(() => {
    setAllMessages();
    if (dialog) {
      getMessages(dialog)
        .then((messages) => {})
        .catch((error) => {
          console.error(error);
        });
    }
  }, [dialog]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: messagesRef.current.id,
    });
    //  messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };
  useEffect(() => {
    if (messages) {
      if (messages[chosenDialog._id]) {
        for (let i = 0; i < messages[chosenDialog._id].length; i++) {
          setAllMessages(() => {
            return messages[chosenDialog._id].map((e) => {
              return (
                <Message
                  usersInGroups={usersInGroups}
                  key={e.index}
                  message={e}
                  dialogInfo={dialog}
                />
              );
            });
          });
        }
      }
    }
  }, [messages]);

  const onSendMessage = (e) => {
    const opponentId = dialog.occupants_ids.filter(
      (id) => id !== parseInt(localStorage.userId)
    )[0];
    if (messageRef.current.value.trim()) {
      let message = messageRef.current.value.replaceAll("\n+", "\n");
      message = message.replaceAll("((?!\n+)\\s+)", " ");
      message = message.replaceAll("((?!\n+)\\s+)", "");

      sendMessage(dialog, message, opponentId);
      messageRef.current.style.height = "45px";
      messageRef.current.value = "";
    }
  };

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="main__container">
      <div className="main__header">
        {dialog && <UserInfo userInfo={dialog} />}
        {!dialog && <div className="header-none">Chats</div>}
      </div>
      <div
        id="messages__container"
        className="messages__container"
        ref={messagesRef}
      >
        {dialog && (
          <div id="messages" className="messages">
            {allMessages ? (
              allMessages
            ) : (
              <span className="no-msg">NO MESSAGES YET</span>
            )}
          </div>
        )}
        {!dialog && <div className="choose__chat">Choose a chat</div>}
      </div>
      {dialog && (
        <form action="#" method="GET" onKeyDown={onEnterPress}>
          <textarea
            ref={messageRef}
            className="message__area"
            placeholder="Enter message"
          ></textarea>

          <button onClick={onSendMessage} type="button" className="send-btn">
            Send
          </button>
        </form>
      )}
    </div>
  );
};

export default Main;
