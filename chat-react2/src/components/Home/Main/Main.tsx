import { useState, useRef, useMemo } from "react";
import { animateScroll } from "react-scroll";
import { useChat } from "@connectycube/use-chat";
import { IoIosArrowDown } from "react-icons/io";
import Message from "./Message";
import ChatHeader from "./ChatHeader";
import ChatInfo from "./ChatInfo";
import ChatInput from "./ChatInput";

const Main = () => {
  const {
    sendMessage,
    selectedDialog,
    messages,
    users,
    sendTypingStatus,
    sendMessageWithAttachment
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
      return messages[selectedDialog._id].map((msg, index) => {
        const sender = users[msg.sender_id];
        if (!sender) {
          return null;
        }
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
  }, [messages, users, selectedDialog]);

  const handleSendMessage = (text: string) => {
    sendMessage(text);
    scrollToBottom();
  };

  return (
    <div
      className={`flex h-full w-full bg-white flex-row-reverse overflow-hidden relative ${
        selectedDialog ? "" : "hidden sm:block"
      }`}
    >
      <ChatInfo toggleProfile={toggleProfile} showProfile={showProfile} />
      <div
        className={
          "flex flex-col justify-between h-full w-full overflow-hidden bg-white transition-all duration-200"
        }
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-300 mx-4 py-2">
          {selectedDialog ? (
            <ChatHeader toggleProfile={toggleProfile} />
          ) : (
            <div className="flex items-center justify-center text-center text-[30px] font-semibold h-[60px] w-full">
              Chats
            </div>
          )}
        </div>

        {/* Messages Container */}
        <div
          id="messages__container"
          className="flex flex-col-reverse h-full w-full overflow-y-auto overflow-x-hidden bg-white pb-1 relative"
          ref={messagesContainerRef}
        >
          {selectedDialog ? (
            <div id="messages" className="flex flex-col px-4 w-[90%] mx-auto">
              {messages ? (
                messagesView
              ) : (
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  NO MESSAGES YET
                </span>
              )}
              {selectedDialog.unread_messages_count > 0 && (
                <div
                  onClick={scrollToBottom}
                  className="fixed flex items-center justify-center top-[83%] left-[96%] border rounded-full w-9 h-9 cursor-pointer"
                >
                  <IoIosArrowDown size={26} />
                  <div className="absolute flex items-center justify-center top-[-76%] bg-blue-400 text-white rounded-full w-6 h-6">
                    <span>{selectedDialog.unread_messages_count}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[20px]">
              Choose a chat
            </div>
          )}
        </div>

        {/* Chat Input */}
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
