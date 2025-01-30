import React, { useMemo } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import { useChat } from "@connectycube/use-chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import Avatar from "../../shared/avatar";

export interface ChatHeaderProps {
  toggleProfile: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ toggleProfile }) => {
  const navigate = useNavigate();
  const {
    selectedDialog,
    leaveGroupChat,
    lastActivity,
    getDialogOpponentId,
    typingStatus,
    users,
    selectDialog,
  } = useChat();
  const isGroupChat = selectedDialog.type === 2;

  const opponentId = getDialogOpponentId();

  const typingLabel = useMemo(() => {
    if (!typingStatus[selectedDialog?._id]) {
      return null;
    }

    const names = [];
    for (const [userIdString, isTyping] of Object.entries(
      typingStatus[selectedDialog._id]
    )) {
      if (isTyping) {
        const userId = +userIdString;
        const user = users[userId];
        names.push(user.full_name || user.login);
      }
    }

    return names.length > 0
      ? `${names.join()} ${names.length > 1 ? "are" : "is"} typing`
      : "";
  }, [selectedDialog, typingStatus]);

  const exitChat = async () => {
    await leaveGroupChat();
    navigate("/home");
  };

  return (
    <div className="flex justify-between relative items-center absolute top-1/2 -translate-y-1/2">
      <div className="flex items-center relative">
        {/* Back Button */}
        <IoIosArrowBack
          size={32}
          onClick={() => {
            selectDialog(null);
            navigate("/home");
          }}
          className="pr-2 cursor-pointer block md:hidden"
        />

        {/* User Avatar */}
        <div
          className="flex items-center justify-center mr-3 w-15 h-15 rounded-full bg-blue-300 cursor-pointer"
          onClick={toggleProfile}
        >
          <Avatar
            imageUID={selectedDialog.photo}
            name={selectedDialog.name}
            className="w-[50px] h-[50px]"
          />
        </div>

        {/* User Info */}
        <div className="flex flex-col items-start">
          <span
            className="text-black font-medium cursor-pointer"
            onClick={toggleProfile}
          >
            {selectedDialog.name}
          </span>
          <div className="text-sm italic pt-1">
            {typingStatus && !isGroupChat ? (
              typingStatus.isTyping ? (
                "typing..."
              ) : (
                <span className="text-gray-500 truncate">
                  {lastActivity[opponentId as number]}
                </span>
              )
            ) : isGroupChat ? (
              <span>{typingLabel}</span>
            ) : (
              <span className="text-gray-500 truncate">
                {lastActivity[opponentId as number]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* More Options Dropdown */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="mr-2 cursor-pointer">
          <FiMoreHorizontal fontSize={25} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={exitChat}>Exit chat</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default React.memo(ChatHeader);
