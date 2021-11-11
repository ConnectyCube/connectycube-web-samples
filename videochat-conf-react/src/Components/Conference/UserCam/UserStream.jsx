import "./UserStream.scss";
import React, { useCallback } from "react";
import UserStats from "./UserStats/UserStats";
import { useEffect } from "react/cjs/react.development";

const UserStream = (props) => {
  const {
    stream,
    userId,
    bitrate,
    micLevel,
    connectionStatus,
    userName,
    isMobile,
    streamNumber,
    fullScreen,
  } = props;

  const videoRef = useCallback(
    (videoElement) => {
      if (!stream || !videoElement) {
        return;
      }
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = function (e) {
        videoElement.play();
      };
    },

    [stream]
  );
  useEffect(
    () => () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    },
    [stream]
  );

  return (
    <div
      id="user__cam-container"
      className={`user__cam-container stream${streamNumber || "0"}`}
    >
      <div className="lds-dual-ring-main"></div>{" "}
      <div
        className={`user__stats-btn ${connectionStatus}`}
        onMouseOver={() => {
          document.getElementById(`user__stats-${userId}`).style.opacity = "1";
        }}
        onMouseOut={() => {
          document.getElementById(`user__stats-${userId}`).style.opacity = "0";
        }}
      ></div>
      <UserStats
        userId={userId}
        micLevel={micLevel}
        bitrate={bitrate}
        connectionStatus={connectionStatus}
      />
      <video
        playsInline
        muted={userId === "me"}
        id={`user__cam-${userId}`}
        className={`user__cam`}
        preload="yes"
        ref={videoRef}
      ></video>
      <input
        type="image"
        className={`full__screen ${isMobile ? `hide` : ``}`}
        onClick={() => {
          fullScreen(userId);
        }}
        alt="Full screen button"
        src="../../img/full-screen.png"
      />
      <span className={`user__name`}>{userName}</span>
    </div>
  );
};

export default UserStream;
