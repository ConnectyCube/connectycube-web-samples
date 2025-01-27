import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-ui/avatar";
import ConnectyCube from "connectycube";

export interface ParticipantProps {
  avatar: string | null;
  name: string;
}

const Participant: React.FC<ParticipantProps> = ({ avatar, name }) => {
  const avatarUrl = avatar
    ? ConnectyCube.storage.privateUrl(avatar)
    : undefined;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div key={name}>
      <Avatar className="w-[60px] h-[60px] rounded-full object-cover">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <p className="text-center">{name}</p>
    </div>
  );
};

export default React.memo(Participant);
