import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import UserStream from "../UserCam/UserStream";
import "./Conference.scss";
import AuthService from "../../services/auth-service";
import react from "react";
import CallService from "../../services/call-service";
import { useHistory } from "react-router";
import Call from "../../services/call-service";

const Conference = (props) => {
  const allCam = [];

  for (let i = 0; i < props.participants; i += 1) {
    allCam.push(<UserStream key={i} participant={i} />);
  }
  const audioRef = react.createRef();
  const videoRef = react.createRef();
  const setAudioMute = () => {
    audioRef.current.classList.toggle("mute");
    CallService.turnDownVideo();
  };
  const setVideoMute = () => {
    videoRef.current.classList.toggle("mute");
    CallService.turnDownVideo();
  };

  useEffect(() => {
    let history = window.location.pathname;
    console.warn(history);
    const PathCheck = () => {
      if (history.length < 7) {
        console.log("New room");
        // code to run on component mount
      } else {
        let userName = prompt("Enter ur name 2");
        console.log(userName);
        let roomId = history.split("/");
        roomId = atob(roomId[2]);

        AuthService.login(userName).then((user) => {
          // join
          Call.joinMeeting(userName, roomId, user.id);
        });
      }
    };

    // code to run on component mount
    PathCheck();
  }, []);

  return (
    <div className="conference">
      <div className={`users__cams flex-${props.participants}`}>{allCam}</div>
      <div className="user__buttons">
        <button
          type="button"
          ref={audioRef}
          onClick={setAudioMute}
          id="micro__btn"
          className="call__btn micro__btn"
        >
          <img src="../img/mic.svg" alt="Micro" />
        </button>
        <button
          ref={videoRef}
          onClick={setVideoMute}
          id="video_btn"
          className="call__btn video__btn"
        >
          <img src="../img/video.svg" alt="Video" />
        </button>
        <NavLink
          to="/"
          id="end__btn"
          onClick={AuthService.logout}
          className="call__btn end__btn"
        >
          <img src="../img/call_end.svg" alt="Call end" />
        </NavLink>
        <button id="switch__btn" className="call__btn switch__btn">
          <img src="../img/switch_video.svg" alt="Switch" />
        </button>
        <button id="share__btn" className="call__btn share__btn">
          <img src="../img/share.svg" alt="Share" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(Conference);
