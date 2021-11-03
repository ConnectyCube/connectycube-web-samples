import React, { useState } from "react";
import UserStream from "./UserCam/UserStream";
import "./Conference.scss";
import AuthService from "../../services/auth-service";
import react from "react";
import Devices from "./Devices/Devices";
import JoinScreen from "../JoinScreen/JoinScreen";
import { useHistory } from "react-router";
import { isMobile } from "../../services/heplers";

const Conference = (props) => {
  let href = useHistory();

  const [preJoinScreen, setPreJoinScreen] = useState(true);
  const [videOff, setVideoOff] = useState("");
  const [audioOff, setAudioOff] = useState("");
  const { toggleVideo, toggleAudio, devices } = props.call;

  const onPrejoinFinish = (userName, isVideo, isAudio) => {
    const hrefState = href.location.state;

    if (hrefState) {
      AuthService.login(userName).then((user) => {
        props.call
          .createAndJoinMeeting(
            user.id,
            user.login,
            user.full_name,
            "user__cam",
            isVideo,
            isAudio
          )
          .then((state) => {
            const confRoomIdHash = btoa(state.meetingId);
            href.push(`${confRoomIdHash}`, "Creator");
            setPreJoinScreen(false);
            if (!isVideo) {
              setVideoOff(`mute`);
            }
            if (!isAudio) {
              setAudioOff(`mute`);
            }
            debugger;
          })
          .catch((error) => {
            alert(error);
            href.location.pathname = "/";
          });
      }); //   alert("New room");
      //   // code to run on component mount
    } else {
      const history = window.location.pathname;
      let roomId = history.split("/");
      roomId = atob(roomId[2]);
      AuthService.login(userName).then((user) => {
        setTimeout(() => {
          props.call
            .joinMeeting(
              user.full_name,
              roomId,
              user.id,
              `user__cam`,
              isVideo,
              isAudio
            )
            .then((devices) => {})
            .catch((error) => {
              debugger;
              window.location.href = "/";
            });
        }, 1000);
      });
      setPreJoinScreen(false);
    }
  };

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

  const usersStreams = [];
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
  let speakerUser;
  let usersSortedById;
  if (props.call.view === "grid") {
    for (let i = 0; i < props.call.participants.length; i += 1) {
      let user = props.call.participants[i];
      usersStreams.push(
        <UserStream
          key={i}
          streamNumber={i}
          userId={user.name === "Me" ? "me" : user.userId}
          userName={user.name}
          stream={user.stream}
          fullScreen={fullScreen}
          bitrate={user.bitrate}
          micLevel={user.micLevel}
          isMobile={props.call.isMobile}
          connectionStatus={props.call.participants[i].connectionStatus}
        />
      );
    }
  } else {
    let usersSortedByMicLevel = props.call.participants.sort((a, b) => {
      if (a.micLevel < b.micLevel) {
        return -1;
      }
      if (a.micLevel > b.micLevel) {
        return 1;
      }
      return 0;
    });

    speakerUser = usersSortedByMicLevel[usersSortedByMicLevel.length - 1];
    //  speakerUser = props.call.participants[0];

    usersSortedById = props.call.participants.sort((a, b) => {
      if (a.userId < b.userId) {
        return -1;
      }
      if (a.userId > b.userId) {
        return 1;
      }
      return 0;
    });

    for (let i = 0; i < usersSortedById.length; i += 1) {
      let user = usersSortedById[i];
      if (user.userId !== speakerUser.userId) {
        usersStreams.push(
          <UserStream
            key={i}
            streamNumber={i}
            userId={user.name === "Me" ? "me" : user.userId}
            userName={user.name}
            stream={user.stream}
            fullScreen={fullScreen}
            bitrate={props.call.participants[i].bitrate}
            micLevel={props.call.participants[i].micLevel}
            isMobile={props.call.isMobile}
            connectionStatus={props.call.participants[i].connectionStatus}
          />
        );
      } else {
        props.call.speakerStream(user.userId);

        speakerUser = (
          <UserStream
            userId={user.name === "Me" ? "me" : user.userId}
            userName={user.name}
            stream={user.stream}
            fullScreen={fullScreen}
            bitrate={props.call.participants[i].bitrate}
            micLevel={props.call.participants[i].micLevel}
            isMobile={props.call.isMobile}
            connectionStatus={props.call.participants[i].connectionStatus}
          />
        );
      }
    }
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
    button.classList.toggle("recording");
    props.call.recording();
  };

  return (
    <div id="conference" className="conference">
      {preJoinScreen === true && (
        <JoinScreen
          onPrejoinFinish={onPrejoinFinish}
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
        />
      )}
      {!preJoinScreen && (
        <div className="conference__container">
          <select
            className="view__changer"
            onChange={(e) => {
              props.call.viewChange(e.target.value);
            }}
          >
            <option value="grid">Grid</option>
            <option value="sidebar">Speaker Full + sidebar</option>
          </select>
          <div className={`streams_container ${props.call.view}`}>
            {props.call.view === "sidebar" && (
              <div className={"speaker-stream"} id="speakerStream">
                {speakerUser}
              </div>
            )}
            <div
              className={`users__cams ${props.call.view} ${props.call.view}-${props.call.participants.length}`}
            >
              {usersStreams}
            </div>
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
              className={`call__btn micro__btn ${audioOff}`}
            >
              <img src="../img/mic.svg" alt="Micro" />
            </button>
            <button
              ref={videoRef}
              onClick={onSetVideoMute}
              disabled={!devices.video}
              id="video_btn"
              className={`call__btn video__btn ${videOff}`}
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
              disabled={!devices.video}
              onClick={onSwitchCamera}
              id="switch__btn"
              className="call__btn switch__btn"
            >
              <img src="../img/switch_video.svg" alt="Switch" />
            </button>
            <button
              onClick={onStartScreenSharing}
              id="share__btn"
              className={`call__btn share__btn ${
                props.call.isMobile ? `hide` : ``
              }`}
              disabled={props.call.isMobile ? true : !devices.video}
            >
              <img src="../img/share.svg" alt="Share" />
            </button>
            <button
              onClick={onRecording}
              id="record__button"
              className="record__button"
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conference;
