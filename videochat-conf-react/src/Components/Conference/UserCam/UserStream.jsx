import "./UserStream.scss";
import React from "react";

const UserStream = (props) => {
  return (
    <div className={`user__cam-container stream${props.streamNumber}`}>
      <video
        playsInline
        id={`user__cam-${props.userId}`}
        className={`user__cam `}
        preload="yes"
      ></video>
      <input
        type="button"
        className="full__screen"
        onClick={() => {
          props.fullScreen(props.userId);
        }}
        value='press F to pay respect'
        name={`full-${props.userId}`}
      />
      <span className={`user__name`}>{props.userName}</span>
    </div>
  );
};

export default UserStream;
