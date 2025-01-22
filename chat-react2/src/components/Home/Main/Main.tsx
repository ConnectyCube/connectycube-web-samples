import { useEffect, useState, useRef, useMemo } from "react";
import { animateScroll } from "react-scroll";
import { useChat } from "@connectycube/use-chat";
import { IoMdAttach } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import Message from "./Message/Message";
import UserInfo from "./UserInfo/UserInfo";
import ChatInfo from "./ChatInfo/ChatInfo";
import "./Main.scss";

const Main = () => {
  const {
    sendMessage,
    selectedDialog,
    messages,
    users,
    sendTypingStatus,
    sendMessageWithAttachment,
  } = useChat();

  const [showProfile, setShowProfile] = useState(false);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLInputElement>(null);
  const isTyping = useRef(false);

  useEffect(() => {
    isTyping.current = false;
  }, [selectedDialog]);

  const handleSendMessage = () => {
    isTyping.current = false;

    const messageText = messageInputRef.current?.value.trim() || "";
    if (messageText.length > 0) {
      sendMessage(messageText); // send message to selected dialog
      messageInputRef.current!.value = "";
      scrollToBottom();
    }
  };

  const onFileSelected = (event: {
    currentTarget: { files: any[] };
    target: { value: string };
  }) => {
    isTyping.current = false;

    const file = event.currentTarget.files[0];
    const type = file.type.split("/")[1];
    if (
      type === "svg+xml" ||
      type === "image" ||
      type === "webp" ||
      type === "png" ||
      type === "jpeg"
    ) {
      sendMessageWithAttachment(file);
    } else {
      alert(
        "File format is not supported. Only images supported in this code sample"
      );
    }
    event.target.value = "";
  };

  const onEnterPress = (event: {
    keyCode: number;
    shiftKey: boolean;
    preventDefault: () => void;
  }) => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();

      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: messagesContainerRef.current?.id,
    });
  };

  const startTyping = () => {
    if (!isTyping.current) {
      isTyping.current = true;
      sendTypingStatus(); // send typing to selected chat
    }
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const messagesView = useMemo(() => {
    if (selectedDialog) {
      for (let i = 0; i < messages[selectedDialog._id].length; i++) {
        return messages[selectedDialog._id].map((msg, index) => {
          const sender = users[msg.sender_id];
          return (
            <Message
              key={index}
              message={msg}
              senderName={sender.full_name || sender.login}
              senderAvatar={sender.avatar}
              isGroupChat={selectedDialog.type === 2}
              dialogName={selectedDialog.name}
            />
          );
        });
      }
    }
  }, [messages, users]);

  return (
    <div className={`main__container ${selectedDialog ? "show" : ""}`}>
      <ChatInfo toggleProfile={toggleProfile} showProfile={showProfile} />
      <div className={`main__content ${showProfile ? "small" : ""}`}>
        <div className="main__header">
          {selectedDialog && <UserInfo toggleProfile={toggleProfile} />}
          {!selectedDialog && <div className="header-none">Chats</div>}
        </div>
        <div
          id="messages__container"
          className="messages__container"
          ref={messagesContainerRef}
        >
          {selectedDialog && (
            <div id="messages" className="messages">
              {messages ? (
                messagesView
              ) : (
                <span className="no-msg">NO MESSAGES YET</span>
              )}
              {selectedDialog.unread_messages_count > 0 && (
                <div
                  onClick={scrollToBottom}
                  className="unread__messages-scroll"
                >
                  <IoIosArrowDown size={26} />
                  <div className="unread__messages-counter">
                    <span>{selectedDialog.unread_messages_count}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {!selectedDialog && <div className="choose__chat">Choose a chat</div>}
        </div>
        {selectedDialog && (
          <form
            className="message__field"
            action="#"
            method="GET"
            onKeyDown={onEnterPress}
          >
            <textarea
              onKeyDown={startTyping}
              ref={messageInputRef}
              className="message__area"
              placeholder="Enter message"
            ></textarea>
            <label htmlFor="file-upload" className="custom-file-upload">
              <IoMdAttach size={28} />
            </label>
            <input
              onChange={onFileSelected}
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept="image/*"
            />

            <button
              onClick={handleSendMessage}
              type="button"
              className="send-btn"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Main;
