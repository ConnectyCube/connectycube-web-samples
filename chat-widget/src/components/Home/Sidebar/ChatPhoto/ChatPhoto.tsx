import React from "react";
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-ui/avatar";
import ConnectyCube from "connectycube";

<<<<<<<< HEAD:chat-widget/src/components/Home/Sidebar/ChatPhoto/ChatPhoto.tsx
export interface ChatPhotoProps {
  photo: string | null;
========
export interface AvatarProps {
  imageUID: string;
>>>>>>>> f00c09dda95de904f6c4b485e8873a33c091f010:chat-widget/src/components/Shared/Avatar.tsx
  name: string;
}

const Avatar: React.FC<AvatarProps> = ({ imageUID, name }) => {
  const photoUrl = imageUID
    ? ConnectyCube.storage.privateUrl(imageUID)
    : undefined;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <AvatarComponent>
      <AvatarImage src={photoUrl} />
      <AvatarFallback>{initials}</AvatarFallback>
    </AvatarComponent>
  );
};

export default React.memo(Avatar);
