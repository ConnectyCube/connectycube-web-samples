import React, { useMemo } from "react";
import { IoCheckmarkSharp, IoCheckmarkDoneSharp } from "react-icons/io5";
import { useInView } from "react-intersection-observer";
import { useConnectyCube, type Messages } from "@connectycube/react";
import Avatar from "../../shared/Avatar";
import Loader from "@/components/shared/Loader";

export interface MessageProps {
  message: Messages.Message;
  isGroupChat: boolean;
  dialogName: string;
  senderName?: string;
  senderAvatar?: string;
}

const Message: React.FC<MessageProps> = ({
  message,
  isGroupChat,
  dialogName,
  senderName,
  senderAvatar,
}) => {
  const { currentUserId, readMessage, messageSentTimeString } = useConnectyCube();

  const isCurrentUserSender = message.sender_id === currentUserId;
  const isAttachment = message.attachments && message.attachments.length > 0;
  const fileUrl = message.attachments?.[0]?.url;

  const senderNameString = isCurrentUserSender
    ? "You"
    : isGroupChat
    ? senderName
    : dialogName;

  const sentTime = useMemo(() => {
    return messageSentTimeString(message);
  }, [message.date_sent]);

  const [ref, inView] = useInView();
  if (inView) {
    if (message.read === 0 && message.sender_id !== currentUserId && message.chat_dialog_id) {
      readMessage(message._id, message.sender_id, message.chat_dialog_id);
    }
  }

  return (
    <div
      ref={ref}
      className={`flex relative max-w-[90%] text-left whitespace-pre-wrap mb-2 ${
        isCurrentUserSender ? "self-end flex-row-reverse" : "self-start"
      } ${inView ? "view" : "no"}`}
    >
      {/* avatar */}
      {isGroupChat && !isCurrentUserSender && (
        <Avatar
          name={senderName}
          imageUID={senderAvatar}
          className="w-12 h-12"
        />
      )}

      <div
        className={`flex flex-col min-w-[150px] bg-gray-200 rounded-xl p-3 ml-3 ${
          isCurrentUserSender ? "mr-3" : ""
        }`}
      >
        {/* sender name in group chat */}
        {isGroupChat && !isCurrentUserSender && (
          <span className="font-semibold">{senderNameString}</span>
        )}

        <div>
          {/* message body */}
          {!isAttachment ? (
            <p className="mb-2 break-all">{message.message}</p>
          ) : null}

          {/* attachments */}
          {isAttachment && (
            <div
              className="relative max-h-[200px] transition duration-200 cursor-pointer"
              onClick={(e) => {
                e.currentTarget.classList.toggle("fixed");
              }}
            >
              {message.isLoading ? (
                <Loader className="mb-2" />
              ) : (
                <img
                  src={fileUrl}
                  className="mb-2 max-h-[200px] object-cover transition duration-200"
                />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-500 italic text-xs absolute bottom-[3px] right-[15px]">
          {/* date sent */}
          <span>{sentTime}</span>

          {/* sent/read status */}
          {isCurrentUserSender && (
            <span>
              {message.read ? (
                <IoCheckmarkDoneSharp size={14} color="#727272" />
              ) : (
                <IoCheckmarkSharp size={14} color="#727272" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
