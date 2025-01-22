import React from "react";
import "./Participant.scss";

export interface ParticipantProps {
  avatar: string;
  name: string;
}

const Participant: React.FC<ParticipantProps> = ({ avatar, name }) => {
  return (
    <div className="user__in-group group-list" key={name}>
      <img
        className="group-list__avatar"
        src={
          avatar ||
          "https://s.aficionados.com.br/imagens/frases-sasuke-uchiha-naruto_t.jpg"
        }
        alt="no avatar"
      />

      <p className="group-list__username">{name}</p>
    </div>
  );
};

export default React.memo(Participant);
