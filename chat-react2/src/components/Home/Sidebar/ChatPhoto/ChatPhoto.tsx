import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-ui/avatar";
import ConnectyCube from "connectycube";
import "./ChatPhoto.scss";

export interface ChatPhotoProps {
  photo: string;
  name: string;
}

const ChatPhoto: React.FC<ChatPhotoProps> = ({ photo, name }) => {
  const photoUrl = photo ? ConnectyCube.storage.privateUrl(photo) : undefined;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <Avatar className="user__img">
      <AvatarImage src={photoUrl} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default React.memo(ChatPhoto);
