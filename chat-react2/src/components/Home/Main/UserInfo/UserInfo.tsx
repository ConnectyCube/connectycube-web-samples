import React, { useMemo } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useChat } from "@connectycube/use-chat";
import "./UserInfo.scss";

export interface UserInfoProps {
  toggleProfile: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ toggleProfile }) => {
  const navigate = useNavigate();
  const {
    selectedDialog,
    leaveGroupChat,
    lastActivity,
    getDialogOpponentId,
    typingStatus,
    users,
  } = useChat();

  const [actionMenuOpen, setActionMenuOpen] = useState(false);

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

  const toggleMore = (close: boolean) => {
    setActionMenuOpen(close ? false : !actionMenuOpen);
  };

  return (
    <div
      className="user__info"
      onMouseLeave={() => {
        toggleMore(true);
      }}
    >
      {actionMenuOpen && (
        <ul className="more__modal">
          <li
            onClick={() => {
              leaveGroupChat();
              navigate("/home");
            }}
          >
            Exit chat
          </li>
        </ul>
      )}
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
                "ATAL TYPE 1"
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
      <div className="user__info-buttons">
        <div
          onClick={() => {
            toggleMore(false);
          }}
          className="button__more"
        >
          <FiMoreHorizontal fontSize={25} />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
