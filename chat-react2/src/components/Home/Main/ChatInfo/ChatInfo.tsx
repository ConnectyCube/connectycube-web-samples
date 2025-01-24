import React, { useMemo, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FiUserPlus } from "react-icons/fi";
import { useChat } from "@connectycube/use-chat";
import ConnectyCube from "connectycube";
import GroupMember from "./GroupMember/GroupMember";
import NewChat from "../../Sidebar/NewChat/NewChat";
import "./ChatInfo.scss";

export interface ChatInfoProps {
  showProfile: boolean;
  toggleProfile: () => void;
}

const ChatInfo: React.FC<ChatInfoProps> = ({ showProfile, toggleProfile }) => {
  const { selectedDialog, users, getDialogOpponentId, lastActivity } =
    useChat();

  const [addUsers, setAddUsers] = useState(false);

  const opponentId = selectedDialog ? getDialogOpponentId() : null;
  const isGroupChat = selectedDialog?.type === 2;

  const photoUrl = selectedDialog?.photo
    ? ConnectyCube.storage.privateUrl(selectedDialog.photo)
    : undefined;
  const initials = selectedDialog?.name.slice(0, 2).toUpperCase();

  const close = () => {
    setAddUsers(false);
  };

  const usersView = useMemo(
    () =>
      selectedDialog?.occupants_ids.map((oId: number) => {
        const user = users[oId];
        return (
          <GroupMember
            userId={user.id}
            name={user.full_name || user.login}
            avatar={user.avatar}
            key={oId}
          />
        );
      }),
    [selectedDialog]
  );

  return (
    <>
      <div className={`profile__info ${showProfile ? "show" : ""}`}>
        {addUsers && (
          <NewChat addUsers={true} onClose={close} chatType="private" />
        )}
        <div className="profile__header">
          <IoIosArrowBack
            onClick={() => {
              toggleProfile();
            }}
            size={32}
          />

          <span>Profile</span>
        </div>
        <div className="profile__main-info">
          <div className="profile__img-container">
            {/* chat photo */}
            {photoUrl ? (
              <img
                className="user__avatar-img"
                src={photoUrl}
                alt="User Photo"
              />
            ) : (
              <div id="background" className="user__no-img profile">
                <span className="name">{initials}</span>
              </div>
            )}
            <div className="profile__user-info">
              {/* chat name */}
              <p>{selectedDialog?.name || ""}</p>

              {/* last seen / members count */}
              {isGroupChat ? (
                <p className="members__count">
                  {selectedDialog.occupants_ids.length} members
                </p>
              ) : (
                <p className="last__activity">
                  {opponentId && lastActivity[opponentId as number]}
                </p>
              )}
            </div>

            {/* members list */}
            {isGroupChat && (
              <div className="profile__group-members">
                <div className="group__members-header">
                  <span className="group-members__title"> Members</span>

                  <FiUserPlus
                    onClick={() => {
                      setAddUsers(true);
                    }}
                    className="group__members-add"
                    size={28}
                  />
                </div>
                <div className="members__container">{usersView}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ChatInfo);
