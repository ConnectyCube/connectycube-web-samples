import React, { useEffect } from "react";
import UserStream from "./UserCam/UserStream";
import "./Conference.scss";
import AuthService from "../../services/auth-service";
import react from "react";
import { useState } from "react/cjs/react.development";
import { createElement } from "react";
import { useHistory } from "react-router";
import Devices from "./Devices/Devices";

const Conference = (props) => {
  let href = useHistory();
  let cams = "Ur cam";
  useEffect(() => {
    const PathCheck = () => {
      // join
      const hrefState = href.location.state;
      console.log("href", href.location.state);
      debugger;
      if (hrefState === "Creator") {
        alert("New room");
        // code to run on component mount
      } else {
        let userName = prompt("Enter ur name 2");
        console.log(userName);
        const history = window.location.pathname;
        let roomId = history.split("/");
        console.log(roomId);
        roomId = atob(roomId[2]);
        AuthService.login(userName).then((user, session) => {
          props.call
            .joinMeeting(user.full_name, roomId, user.id, `user__cam`)
            .then((devices) => {
              setVideo(devices.video);
              debugger;
            })
            .catch((error) => {
              alert(error);
              window.location.href = "/";
            });
        });
      }
    };

    // code to run on component mount
    PathCheck();
  }, []);
  let [video, setVideo] = useState(props.call.devices.video);
  debugger;
  let camName = [];

  if (props.call.cams) {
    for (let i = 0; i < props.call.cams.length; i += 1) {
      camName.push(<Devices call = {props.call} camInfo={props.call.cams[i]} />);
    }
  }
  debugger;
  const allCam = [];
  for (let i = 0; i < props.call.participants.length; i += 1) {
    const user = props.call.participants[i];
    allCam.push(
      <UserStream
        key={i}
        streamNumber={i}
        userId={user.name === "Me" ? "me" : user.userId}
        userName={user.name}
      />
    );
  }
  const audioRef = react.createRef();
  const videoRef = react.createRef();
  const devicesRef = react.createRef();
  const setAudioMute = () => {
    audioRef.current.classList.toggle("mute");
    let muted = props.call.turnDownAudio();
  };
  const setVideoMute = () => {
    videoRef.current.classList.toggle("mute");
    let muted = props.call.turnDownVideo();
    let cam = document.getElementById("user__cam-me");
    cam.classList.toggle("muted");
  };

  const [allDevices, setAllDevices] = useState([]);

  const switcher = () => {
    let devices = document.getElementById("user__devices");
    devices.classList.toggle("active");
  };
  const screenShare = () => {
    props.call.screenShare();
  };

  return (
    <div className="conference">
      <div className={`users__cams grid-${props.call.participants.length}`}>
        {allCam}
      </div>
      <div className="user__buttons">
        <div id="user__devices" className="user__devices">
          {camName}
        </div>
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
          disabled={!video}
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
        <button
          disabled={!video}
          onClick={switcher}
          id="switch__btn"
          className="call__btn switch__btn"
        >
          <img src="../img/switch_video.svg" alt="Switch" />
        </button>
        <button
          onClick={screenShare}
          id="share__btn"
          className="call__btn share__btn"
          disabled={!video}
        >
          <img src="../img/share.svg" alt="Share" />
        </button>
      </div>
    </div>
  );
};

export default Conference;
