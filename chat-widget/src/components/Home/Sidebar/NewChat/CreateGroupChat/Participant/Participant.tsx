import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-ui/avatar";
import ConnectyCube from "connectycube";
import "./Participant.scss";

export interface ParticipantProps {
  avatar: string | null;
  name: string | null;
}

const Participant: React.FC<ParticipantProps> = ({ avatar = '', name }) => {
  const avatarUrl = avatar
    ? ConnectyCube.storage.privateUrl(avatar)
    : undefined;
  const initials = name?.slice(0, 2).toUpperCase();

  return (
    <div className="user__in-group group-list" key={name}>
      <Avatar className="group-list__avatar">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <p className="group-list__username">{name}</p>
    </div>
  );
};

export default React.memo(Participant);
