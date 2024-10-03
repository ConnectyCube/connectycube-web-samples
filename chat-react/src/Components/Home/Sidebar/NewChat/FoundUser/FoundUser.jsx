import React, { useEffect, useState } from "react";
import "./FoundUser.scss";

const FoundUser = (props) => {
  const { userInfo, close, type, groupChatUsers, startChat, groupOccupants } =
    props;
  
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setChecked(
      groupOccupants.find((e) => {
        return e.id === userInfo.id;
      })
    );
  }, [userInfo, groupOccupants]);
  const startChatting = () => {
    close();
    startChat(userInfo.id);
  };
  return (
    <div
      className={`found__user ${checked ? "checked" : "not-checked"}`}
      key={userInfo.id}
    >
      <div className="user__main-info">
        <div className="user__avatar">
          <img
            src={
              userInfo.avatar
                ? userInfo.avatar
                : "https://s.aficionados.com.br/imagens/frases-sasuke-uchiha-naruto_t.jpg"
            }
            alt="Avatatar"
          />
        </div>
        <div className="user__name-info">
          <p className="user__full-name">
            {userInfo.full_name ? userInfo.full_name : "No name"}
          </p>
          <span className="user__login">@{userInfo.login}</span>
        </div>
      </div>
      {type === 1 ? (
        <button
          type="button"
          onClick={startChatting}
          className="add__btn"
          fontSize="2em"
          color="white"
        >
          Start chat
        </button>
      ) : (
        <div
          className={`add-status ${checked ? "delete" : "add"}`}
          onClick={(e) => {
            groupChatUsers(!checked, userInfo);
            checked ? setChecked(false) : setChecked(true);
          }}
        >
          {checked ? "Delete" : "Add"}
        </div>
      )}
    </div>
  );
};

export default FoundUser;
