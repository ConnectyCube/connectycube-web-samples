import React, { useEffect, useRef } from "react";
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
      className="flex relative gap-3 w-[90%] mx-auto pt-2 pb-2 border-t border-gray-300"
      action="#"
      method="GET"
      onKeyDown={onEnterPress}
    >
      <textarea
        onKeyDown={startTyping}
        ref={messageInputRef}
        className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg resize-none placeholder-gray-500 text-base"
        placeholder="Enter message"
      ></textarea>
      <button
        onClick={handleSendMessage}
        type="button"
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded"
      >
        Send
      </button>
      <label htmlFor="file-upload" className="inline-block pt-2 cursor-pointer">
        <IoMdAttach size={28} />
      </label>
      <input
        onChange={onFileSelected}
        ref={fileInputRef}
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
      />
    </form>
  );
};

export default React.memo(ChatInput);
