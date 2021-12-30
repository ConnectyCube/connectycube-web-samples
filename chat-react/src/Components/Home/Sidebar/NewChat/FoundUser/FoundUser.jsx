import React from "react";
import "./FoundUser.scss";
import ConnectyCube from "connectycube";

const FoundUser = (props) => {
  const { userInfo, getChats, close } = props;

  const startChat = (e) => {
    close();
    const params = {
      type: 3,
      occupants_ids: [userInfo.id],
    };
    ConnectyCube.chat.dialog
      .create(params)
      .then((dialog) => {
        getChats();
      })
      .catch((error) => {});
  };
  return (
    <div className="found__user">
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
      <button
        type="button"
        onClick={startChat}
        className="add__btn"
        fontSize="2em"
        color="white"
      >
        Start chat
      </button>
    </div>
  );
};

export default FoundUser;
