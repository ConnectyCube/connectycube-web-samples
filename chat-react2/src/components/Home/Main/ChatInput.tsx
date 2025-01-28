import React, { useEffect, useRef } from "react";
import "./ChatInput.scss";
import { IoMdAttach } from "react-icons/io";
import { useChat } from "@connectycube/use-chat";

export interface ChatInputProps {
  sendMessage: (message: string) => void;
  sendMessageWithAttachment: (file: File) => void;
  sendTypingStatus: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  sendMessage,
  sendMessageWithAttachment,
  sendTypingStatus,
}) => {
  const { selectedDialog } = useChat();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const isTyping = useRef(false);

  useEffect(() => {
    isTyping.current = false;
  }, [selectedDialog]);

  const handleSendMessage = () => {
    isTyping.current = false;

    const messageText = messageInputRef.current?.value.trim() || "";
    if (messageText.length > 0) {
      sendMessage(messageText);
      messageInputRef.current!.value = "";
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

  const startTyping = () => {
    if (!isTyping.current) {
      isTyping.current = true;
      sendTypingStatus(); // send typing to selected chat
    }
  };

  return (
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
      <button onClick={handleSendMessage} type="button" className="send-btn">
        Send
      </button>
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
    </form>
  );
};

export default React.memo(ChatInput);
