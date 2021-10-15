import "./UserStream.scss";
import React from "react";

const UserStream = (props) => {
  return (
    <div className="user__cam-container">
      <video id={`user__cam`} className={"user__cam"}></video>
    </div>
  );
};

export default UserStream;
