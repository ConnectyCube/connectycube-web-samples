import React from "react";
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-ui/avatar";
import ConnectyCube from "connectycube";

export interface AvatarProps {
  imageUID?: string;
  name?: string;
  className?: string | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ imageUID, name, className }) => {
  const photoUrl = imageUID ? imageUID.startsWith("http") ? imageUID : ConnectyCube.storage.privateUrl(imageUID) : undefined
  const initials = name ? name.slice(0, 2).toUpperCase() : "NA";

  return (
    <AvatarComponent className={className}>
      <AvatarImage src={photoUrl} />
      <AvatarFallback>{initials}</AvatarFallback>
    </AvatarComponent>
  );
};

export default React.memo(Avatar);
