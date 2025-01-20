import React from "react";
import "./ChatPhoto.scss";

export interface ChatPhotoProps {
  photo: string;
  name: string;
}

const ChatPhoto: React.FC<ChatPhotoProps> = ({ photo, name }) => {
  return (
    <div className="user__img-container">
      {photo ? (
        <img alt="" className="user__img" src={photo} />
      ) : (
        <div id="background" className="user__no-img">
          <span className="name">{name.slice(0, 2)}</span>
        </div>
      )}
    </div>
  );
};

export default  React.memo(ChatPhoto);
