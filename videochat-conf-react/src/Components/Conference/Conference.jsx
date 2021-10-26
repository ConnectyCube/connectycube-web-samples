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
  useEffect(() => {
    if (props.call.isiOS()) {
    }
    const PathCheck = () => {
      // join
      const hrefState = href.location.state;
      if (hrefState === "Creator") {
        //   alert("New room");
        // code to run on component mount
      } else {
        let userName = prompt("Enter ur name 2");
        const history = window.location.pathname;
        let roomId = history.split("/");
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
    props.call.switchCamera(deviceId);
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
        bitrate={props.call.participants[i].bitrate}
        micLevel={props.call.participants[i].micLevel}
        isMobile={props.call.isMobile}
        connectionStatus={props.call.participants[i].connectionStatus}
      />
    );
  }

  const audioRef = react.createRef();
  const videoRef = react.createRef();

  const onSetAudioMute = () => {
    audioRef.current.classList.toggle("mute");
    props.call.toggleAudio();
  };
  const onSetVideoMute = () => {
    videoRef.current.classList.toggle("mute");
    let cam = document.getElementById("user__cam-me");
    cam.classList.toggle("muted");
    props.call.toggleVideo();
  };

  const onSwitchCamera = () => {
    let devices = document.getElementById("user__devices");
    devices.classList.toggle("active");
  };

  const onStartScreenSharing = () => {
    let screenShareButton = document.getElementById("share__btn");
    if (!screenShareButton.classList.contains(`sharing`)) {
      props.call.startScreenSharing();

      screenShareButton.classList.add("sharing");
    } else {
      props.call.stopSharingScreen();
      screenShareButton.classList.remove("sharing");
    }
  };
  const onRecording = () => {
    let button = document.getElementById("record__button");
	 button.classList.toggle("recording")
    props.call.recording();
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
          onClick={onSetAudioMute}
          id="micro__btn"
          className="call__btn micro__btn"
        >
          <img src="../img/mic.svg" alt="Micro" />
        </button>
        <button
          ref={videoRef}
          onClick={onSetVideoMute}
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
          onClick={onSwitchCamera}
          id="switch__btn"
          className="call__btn switch__btn"
        >
          <img src="../img/switch_video.svg" alt="Switch" />
        </button>
        <button
          onClick={onStartScreenSharing}
          id="share__btn"
          className="call__btn share__btn"
          disabled={props.call.isMobile ? true : !video}
          //  disabled={props.call.isiOS() ? true : !video}
        >
          <img src="../img/share.svg" alt="Share" />
        </button>
        <button
          onClick={onRecording}
          id="record__button"
          className="record__button"
        >
          
        </button>
      </div>
    </div>
  );
};

export default Conference;
