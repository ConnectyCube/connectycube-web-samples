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
import "./ChatHeader.scss";

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
    <div className="user__info">
      <div className="user__info-main">
        <IoIosArrowBack
          size={32}
          onClick={() => {
            navigate("/home");
          }}
          className="user__info-back"
        />

        <div
          className="user__avatar-dialog"
          onClick={() => {
            toggleProfile();
          }}
        >
          {selectedDialog.photo ? (
            <img
              className="user__avatar-img"
              src={selectedDialog.photo}
              alt="User Photo"
            />
          ) : (
            <div id="background" className="user__no-img">
              <span className="name">{selectedDialog.name.slice(0, 2)}</span>
            </div>
          )}
        </div>
        <div className="user-name-container">
          <span
            onClick={() => {
              toggleProfile();
            }}
          >
            {selectedDialog.name}
          </span>

          <div className="typing-status">
            {typingStatus && !isGroupChat ? (
              typingStatus.isTyping ? (
                "typing..."
              ) : !isGroupChat ? (
                <span className="last__activity">
                  {lastActivity[opponentId as number]}
                </span>
              ) : (
                "someone typing"
              )
            ) : !isGroupChat ? (
              <span className="last__activity">
                {lastActivity[opponentId as number]}
              </span>
            ) : (
              ""
            )}
            {isGroupChat ? <span>{typingLabel}</span> : ""}
          </div>
        </div>
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="user__info-buttons">
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
