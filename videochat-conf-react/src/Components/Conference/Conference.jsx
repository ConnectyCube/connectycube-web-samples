import React, { useEffect } from "react";
import UserStream from "./UserCam/UserStream";
import "./Conference.scss";
import AuthService from "../../services/auth-service";
import react from "react";
import { useState } from "react/cjs/react.development";
import { useHistory } from "react-router";
import Devices from "./Devices/Devices";

const Conference = (props) => {
  let href = useHistory();
  debugger;

  useEffect(() => {
    if (props.call.isiOS()) {
    }
    const PathCheck = () => {
      // join
      const hrefState = href.location.state;
      console.log("href", href.location.state);
      if (hrefState === "Creator") {
        //   alert("New room");
        // code to run on component mount
      } else {
        let userName = prompt("Enter ur name 2");
        console.log(userName);
        const history = window.location.pathname;
        let roomId = history.split("/");
        console.log(roomId);
        roomId = atob(roomId[2]);
        AuthService.login(userName).then((user) => {
          setTimeout(() => {
            props.call
              .joinMeeting(user.full_name, roomId, user.id, `user__cam`)
              .then((devices) => {
                setVideo(devices.video);
              })
              .catch((error) => {
                //  alert(error);
                window.location.href = "/";
              });
          }, 1000);
        });
      }
    };

    // code to run on component mount
    PathCheck();
    // eslint-disable-next-line
  }, []);

  let [video, setVideo] = useState(props.call.devices.video);

  let camName = [];
  const newDevice = (e) => {
    let deviceId = e.target.name;
    props.call.newCamera(deviceId);
  };
  if (props.call.cams) {
    for (let i = 0; i < props.call.cams.length; i += 1) {
      camName.push(
        <Devices
          key={i}
          call={props.call}
          onClick={newDevice}
          camInfo={props.call.cams[i]}
        />
      );
    }
  }
  const allCam = [];
  const fullScreen = (userId) => {
    debugger;
    let videoItem = document.getElementById(`user__cam-${userId}`);
    if (!document.fullscreenElement) {
      videoItem.requestFullscreen().catch((err) => {
        alert(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };
  for (let i = 0; i < props.call.participants.length; i += 1) {
    let user = props.call.participants[i];
    allCam.push(
      <UserStream
        key={i}
        streamNumber={i}
        userId={user.name === "Me" ? "me" : user.userId}
        userName={user.name}
        fullScreen={fullScreen}
      />
    );
  }

  const audioRef = react.createRef();
  const videoRef = react.createRef();

  const setAudioMute = () => {
    audioRef.current.classList.toggle("mute");
    props.call.toggleAudio();
  };
  const setVideoMute = () => {
    videoRef.current.classList.toggle("mute");
    let cam = document.getElementById("user__cam-me");
    cam.classList.toggle("muted");
    props.call.toggleVideo();
  };

  const switchCamera = () => {
    let devices = document.getElementById("user__devices");
    devices.classList.toggle("active");
  };
  const screenShare = () => {
    props.call.screenShare();
  };

  return (
    <div id="conference" className="conference">
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
          onClick={switchCamera}
          id="switch__btn"
          className="call__btn switch__btn"
        >
          <img src="../img/switch_video.svg" alt="Switch" />
        </button>
        <button
          onClick={screenShare}
          id="share__btn"
          className="call__btn share__btn"
          disabled={props.call.isiOS() ? true : !video}
        >
          <img src="../img/share.svg" alt="Share" />
        </button>
        <button onClick={fullScreen}></button>
      </div>
    </div>
  );
};

export default Conference;
