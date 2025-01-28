import { useState, useRef, useMemo } from "react";
import { animateScroll } from "react-scroll";
import { useChat } from "@connectycube/use-chat";
import { IoIosArrowDown } from "react-icons/io";
import Message from "./Message";
import ChatHeader from "./ChatHeader";
import ChatInfo from "./ChatInfo";
import "./Main.scss";
import ChatInput from "./ChatInput";

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
  const messagesContainerRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: messagesContainerRef.current?.id,
    });
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const messagesView = useMemo(() => {
    if (selectedDialog && messages[selectedDialog._id]) {
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

  const handleSendMessage = (text: string) => {
    sendMessage(text);
    scrollToBottom();
  };

  return (
    <div className={`main__container ${selectedDialog ? "show" : ""}`}>
      <ChatInfo toggleProfile={toggleProfile} showProfile={showProfile} />
      <div className={`main__content ${showProfile ? "small" : ""}`}>
        <div className="main__header">
          {selectedDialog && <ChatHeader toggleProfile={toggleProfile} />}
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
          <ChatInput
            sendMessage={handleSendMessage}
            sendMessageWithAttachment={sendMessageWithAttachment}
            sendTypingStatus={sendTypingStatus}
          />
        )}
      </div>
    </div>
  );
};

export default Main;
