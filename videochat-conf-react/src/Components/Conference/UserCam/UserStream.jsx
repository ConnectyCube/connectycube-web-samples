import "./UserStream.scss";
import React, { useCallback } from "react";
import UserStats from "./UserStats/UserStats";
import { useState } from "react";
import { BiMicrophoneOff } from "react-icons/bi";
import { detectBrowser } from "../../../services/heplers";
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
    isVideo,
    mirror,
    isSharing,
    isMicroMuted,
  } = props;
  const [isStreamLoaded, setIsStreamLoaded] = useState(false);
  const loaderRef = React.createRef();
  const noImageRef = React.createRef();
  const videoRef = useCallback(
    (videoElement) => {
      if (!stream || !videoElement) {
        return;
      }
      videoElement.srcObject = stream;
      setIsStreamLoaded((isStreamLoaded) => true);
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
      {!isVideo && isStreamLoaded && (
        <div ref={noImageRef} className="img__container">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/OOjs_UI_icon_userAvatar.svg/1200px-OOjs_UI_icon_userAvatar.svg.png"
            alt=""
            className="no-image"
          />
        </div>
      )}

      <div id={`fullscreen-stream-${userId}`} className="fullscreen-stream">
        <video
          playsInline
          muted={userId === "me"}
          id={`user__cam-${userId}`}
          className={`user__cam ${isVideo ? "" : "hide"} ${
            userId === "me" ? mirror : false
          } ${isSharing ? "contain" : "cover"} `}
          preload="yes"
          ref={videoRef}
        ></video>
      </div>
      <div className="user__stats-container">
        <div
          className={`user__stats-btn ${connectionStatus}`}
          onMouseOver={() => {
            let stats = document.getElementById(`user__stats-${userId}`);
            stats.style.opacity = "1";
            stats.style.display = "block";
          }}
          onMouseOut={() => {
            let stats = document.getElementById(`user__stats-${userId}`);
            stats.style.opacity = "0";
            stats.style.display = "none";
          }}
        ></div>
        <UserStats
          userId={userId}
          micLevel={micLevel}
          bitrate={bitrate}
          connectionStatus={connectionStatus}
        />
        <input
          type="image"
          className={`full__screen ${
            isMobile || detectBrowser() === "Safari" || userId === "me"
              ? `hide`
              : ``
          }`}
          onClick={() => {
            fullScreen(userId);
          }}
          alt="Full screen button"
          src="../../img/full-screen.png"
        />
        {userId !== "me" && (
          <span className="micro__status">
            {isMicroMuted && (
              <BiMicrophoneOff size={32} style={{ fill: "grey", opacity: 1 }} />
            )}
          </span>
        )}
      </div>

      <span className={`user__name`}>{userName}</span>
    </div>
  );
};

export default UserStream;
