import "./UserStream.scss";
import React, { useContext } from "react";
import UserStats from "./UserStats/UserStats";

const UserStream = (props) => {
  
  return (
    <div className={`user__cam-container stream${props.streamNumber}`}>
		 {/* <button
        onClick={() => {
          props.badConnection(props.userId);
        }}
      >
        Red Light
      </button> */}
      <div
        className={`user__stats-btn ${props.connectionStatus}`}
        onMouseOver={() => {
          document.getElementById(`user__stats-${props.userId}`).style.opacity =
            "100";
        }}
        onMouseOut={() => {
          document.getElementById(`user__stats-${props.userId}`).style.opacity =
            "0";
        }}
      >
        
      </div>
		<UserStats
          userId={props.userId}
          micLevel={props.micLevel}
          bitrate={props.bitrate}
          connectionStatus={props.connectionStatus}
        />
      <video
        playsInline
        id={`user__cam-${props.userId}`}
        className={`user__cam `}
        preload="yes"
      ></video>
      <input
        type="image"
        className="full__screen"
        onClick={() => {
          props.fullScreen(props.userId);
        }}
        alt="Full screen button"
        src="../../img/full-screen.png"
        disabled={props.isMobile}
      />
      
      <span className={`user__name`}>{props.userName}</span>
    </div>
  );
};

export default UserStream;
