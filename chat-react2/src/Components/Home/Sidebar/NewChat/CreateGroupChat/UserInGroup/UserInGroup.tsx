import React from "react";
import "./UserInGroup.scss";

const UserInGroup = (props) => {
  const { user } = props;

  return (
    <div className="user__in-group group-list" key={user.login}>
      <img
        className="group-list__avatar"
        src={
          user.avatar ||
          "https://s.aficionados.com.br/imagens/frases-sasuke-uchiha-naruto_t.jpg"
        }
        alt="no avatar"
      />

      <p className="group-list__username">{user.full_name || user.login}</p>
    </div>
  );
};

export default UserInGroup;
