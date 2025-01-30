import Avatar from "../../../../shared/avatar";
import React from "react";

export interface ParticipantProps {
  avatar?: string;
  name: string;
}

const Participant: React.FC<ParticipantProps> = ({ avatar, name }) => {
  return (
    <div key={name}>
      <Avatar imageUID={avatar} name={name} className="w-[50px] h-[50px]" />

      <p className="text-center">{name}</p>
    </div>
  );
};

export default React.memo(Participant);
