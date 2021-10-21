import "./UserStream.scss";
import React from "react";

const UserStream = (props) => {
  return (
    <div className={`user__cam-container stream${props.streamNumber}`}>
      <video
        playsInline
        id={`user__cam-${props.userId}`}
        className={`user__cam `}
        preload="metadata"
        
      ></video>

      <span className={`user__name`}>{props.userName}</span>
    </div>
  );
};

export default UserStream;
