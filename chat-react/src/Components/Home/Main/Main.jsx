import React from "react";
import "./Main.scss";
import { useEffect, useState } from "react";
import Message from "./Message/Message";
import UserInfo from "./UserInfo/UserInfo";

const Main = (props) => {
  const { sendMessage, chosenDialog, getMessages, messages } = props;
  const dialog = chosenDialog;
  const messageRef = React.createRef();
  const [allMessages, setAllMessages] = useState();
  useEffect(() => {
    setAllMessages();
    if (dialog) {
      getMessages(dialog)
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
    }
  }, [dialog]);
  useEffect(() => {
    if (messages) {
      let sortedMessages = messages.sort((a, b) => {
        if (a.date_sent < b.date_sent) {
          return -1;
        }
        if (a.date_sent > b.date_sent) {
          return 1;
        }
        return 0;
      });
      for (let i = 0; i < sortedMessages.length; i++) {
        setAllMessages(() => {
          return sortedMessages.map((e) => {
            return <Message key={e.index} message={e} dialogInfo={dialog} />;
          });
        });
      }
    }
  }, [messages]);

  const onSendMessage = (e) => {
    const opponentId = dialog.occupants_ids.filter(
      (id) => id !== parseInt(localStorage.userId)
    )[0];
    if (messageRef.current.value.trim()) {
      messageRef.current.value = messageRef.current.value.replace(
        /(\r\n|\n|\r)/gm,
        ""
      );
      sendMessage(dialog, messageRef.current.value, opponentId);
      messageRef.current.style.height = "45px";
      messageRef.current.value = "";
    }

    //  const message = {
    //    type: dialog.type === 3 ? "chat" : "groupchat",
    //    body: messageRef.current.value,
    //    extension: {
    //      save_to_history: 1,
    //      dialog_id: dialog._id,
    //    },
    //    markable: 1,
    //  };

    //  message.id = ConnectyCube.chat.send(opponentId, message);

    //  // ...

    //  ConnectyCube.chat.onMessageListener = onMessage;

    //  function onMessage(userId, message) {
    //    console.log(
    //      "[ConnectyCube.chat.onMessageListener] callback:",
    //      userId,
    //      message
    //    );
    //  }
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
        {!dialog && <h1>Chats</h1>}
      </div>
      <div className="messages__container">
        {dialog && (
          <div className="messages">
            {allMessages ? allMessages : "NO MESSAGES YET"}
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
