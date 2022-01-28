import React from "react";
import "./Main.scss";
/* eslint-disable */

import { useEffect, useState } from "react";
import Message from "./Message/Message";
import UserInfo from "./UserInfo/UserInfo";
import { animateScroll } from "react-scroll";
import { IoMdAttach } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import Profile from "./Profile/Profile";

const Main = (props) => {
  const {
    sendMessage,
    chosenDialog,
    getMessages,
    messages,
    usersInGroups,
    sendTypingStatus,
    typeStatus,
    sendMsgWithPhoto,
    lastActivity,
    setDialog,
  } = props;
  const dialog = chosenDialog;
  const [showProfile, setShowProfile] = useState(false);
  const fileMessageRef = React.createRef();
  const messageRef = React.createRef();
  const messagesRef = React.createRef();
  const [typingPrevStatus, setTypingPrevStatus] = useState();
  const [allMessages, setAllMessages] = useState();
  useEffect(() => {
    setAllMessages();
    setTypingPrevStatus(false);
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

  const startTyping = () => {
    try {
      clearTimeout(timer);
    } catch {
      console.log("no timer yet");
    }
    if (!typingPrevStatus) {
      setTypingPrevStatus(true);
      if (dialog.type === 3) {
        const occupant = dialog.occupants_ids.filter((e) => {
          return e !== parseInt(localStorage.userId);
        });
        sendTypingStatus(true, occupant[0]);
      } else {
        sendTypingStatus(true, dialog._id);
      }
    }
    let timer = setTimeout(() => {
      const occupant = dialog.occupants_ids.filter((e) => {
        return e !== parseInt(localStorage.userId);
      });
      setTypingPrevStatus(false);
      sendTypingStatus(false, occupant[0]);
    }, 10000);
  };

  const toggleProfile = () => {
    if (showProfile) {
      setShowProfile(false);
    } else {
      setShowProfile(true);
    }
  };

  const onFileSelected = (e) => {
    const file = e.currentTarget.files[0];
    sendMsgWithPhoto(file);
  };

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
    <div className={`main__container ${chosenDialog ? "show" : ""}`}>
      <Profile
        toggleProfile={toggleProfile}
        setDialog={setDialog}
        userInfo={dialog}
        lastActivity={lastActivity}
		  usersInGroups={usersInGroups}
        showProfile={showProfile}
		 
      />
      <div className={`main__content ${showProfile ? "small" : ""}`}>
        <div className="main__header">
          {dialog && (
            <UserInfo
              toggleProfile={toggleProfile}
              setDialog={setDialog}
              userInfo={dialog}
              typeStatus={typeStatus}
              lastActivity={lastActivity}
            />
          )}
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
              onKeyDown={startTyping}
              ref={messageRef}
              className="message__area"
              placeholder="Enter message"
            ></textarea>
            <label for="file-upload" className="custom-file-upload">
              <IoMdAttach size={28} />
            </label>
            <input
              onChange={onFileSelected}
              ref={fileMessageRef}
              id="file-upload"
              type="file"
            />

            <button onClick={onSendMessage} type="button" className="send-btn">
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Main;
