import React from "react";
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-ui/avatar";
import ConnectyCube from "connectycube";

export interface AvatarProps {
  imageUID: string;
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
