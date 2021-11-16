import "./UserStream.scss";
import React, { useCallback } from "react";
import UserStats from "./UserStats/UserStats";
import { useState } from "react";
import { isiOS } from "../../../services/heplers";

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
  const [isStreamLoaded, setIsStreamLoaded] = useState(false);
  const loaderRef = React.createRef();
  const noImageRef = React.createRef();
  setTimeout(() => {
    setIsStreamLoaded((isStreamLoaded) => true);
  }, 4000);

  const videoRef = useCallback(
    (videoElement) => {
      if (!stream || !videoElement) {
        return;
      }
      videoElement.srcObject = stream;

      videoElement.volume = 1;

      videoElement.onloadedmetadata = function (e) {
        videoElement.play();
      };
    },

    [stream]
  );

  return (
    <div
      id="user__cam-container"
      className={`user__cam-container stream${streamNumber || "0"}`}
    >
      {!isStreamLoaded && (
        <div ref={loaderRef} className="lds-dual-ring-main"></div>
      )}
      {isStreamLoaded && (
        <div ref={noImageRef} className="img__container">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/OOjs_UI_icon_userAvatar.svg/1200px-OOjs_UI_icon_userAvatar.svg.png"
            alt=""
            className="no-image"
          />
        </div>
      )}

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
