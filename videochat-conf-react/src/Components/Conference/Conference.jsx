import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import UserStream from "../UserCam/UserStream";
import "./Conference.scss";
import AuthService from "../../services/auth-service";
import react from "react";
import CallContext from "../../services/call-service-2";
import { useState } from "react";
import { rerenderTree } from "../..";

const Conference = (props) => {
  console.table(props.call.participants);

  useEffect(() => {
    let history = window.location.pathname;
    const PathCheck = () => {
      // join

      if (history.length < 7) {
        console.log("New room");
        // code to run on component mount
      } else {
        let userName = prompt("Enter ur name 2");
        console.log(userName);
        let roomId = history.split("/");
        roomId = atob(roomId[2]);
        AuthService.login(userName).then((user, session) => {
          props.call.joinMeeting(user.full_name, roomId, user.id);
        });
      }
    };

    // code to run on component mount
    PathCheck();
  }, []);
  const allCam = [];
  let usersId = props.call.participants.map((u) => {
    if (u.userId == 11111) {
      return null;
    } else {
      return u.userId;
    }
  });
  console.log(props.call.participants);
  let usersName = props.call.participants.map((u) => {
    return u.name;
  });
  for (let i = 0; i < props.call.participants.length; i += 1) {
    allCam.push(
      <UserStream
        key={i}
        streamNumber={i}
        userId={usersId[i]}
        userName={usersName[i]}
      />
    );
  }
  const audioRef = react.createRef();
  const videoRef = react.createRef();
  const setAudioMute = () => {
    audioRef.current.classList.toggle("mute");
  };
  const setVideoMute = () => {
    videoRef.current.classList.toggle("mute");
  };

  return (
    <div className="conference">
      <div className={`users__cams grid-${props.call.participants.length}`}>
        {allCam}
      </div>
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
        <a
          href="/"
          id="end__btn"
          onClick={AuthService.logout}
          className="call__btn end__btn"
        >
          <img src="../img/call_end.svg" alt="Call end" />
        </a>
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
