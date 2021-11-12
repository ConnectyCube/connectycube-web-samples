import React, { useState, useEffect, useContext } from "react";
import UserStream from "./UserCam/UserStream";
import "./Conference.scss";
import AuthService from "../../services/auth-service";
import react from "react";
import Devices from "./Devices/Devices";
import JoinScreen from "../JoinScreen/JoinScreen";
import { useHistory } from "react-router";
import Chat from "./Chat/Chat";
import ChatContext from "../../services/chat-service";
const Conference = (props) => {
  const chat = useContext(ChatContext);
  let href = useHistory();
  const [chatShow, setChatShow] = useState(false);
  const [preJoinScreen, setPreJoinScreen] = useState(true);
  const [audioOff, setAudioOff] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    toggleVideo,
    toggleAudio,
    devices,
    isMobile,
    chatId,
    messages,
    leaveMeeting,
    isVideoMuted,
    participants,
  } = props.call;

  const onPrejoinFinish = (userName, isVideo, isAudio) => {
    const hrefState = href.location.state;
    if (hrefState) {
      setPreJoinScreen(false);
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
            setIsLoaded(true);
            if (!isAudio) {
              setAudioOff(`mute`);
            }
          })
          .catch((error) => {
            alert(error);
            href.location.pathname = "/";
          });
      }); //   alert("New room");
      //   // code to run on component mount
    } else {
      setPreJoinScreen(false);
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
              console.error(error);
            });
        }, 1000);
        setIsLoaded(true);
      });

      if (!isAudio) {
        setAudioOff(`mute`);
      }
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
          userId={user.name === "me" ? "me" : user.userId}
          userName={user.name}
          stream={user.stream}
          fullScreen={fullScreen}
          bitrate={user.bitrate}
          micLevel={user.micLevel}
          isMobile={isMobile}
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
            userId={user.name === "me" ? "me" : user.userId}
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
            userId={user.name}
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
  const containerRef = react.createRef();
  const audioRef = react.createRef();
  const videoRef = react.createRef();
  const buttonsRef = react.createRef();

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
  const onHideButtons = (e) => {
    let clickedItem = e.target.id;
    let classItem = e.target.classList[0];

    if (
      clickedItem === "user__cam-container" ||
      classItem === "users__cams" ||
      classItem === "no-image"
    ) {
      let btns = buttonsRef.current;
      btns.classList.toggle("hide");
    }
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
  const devicesRef = React.createRef();
  const [locationKeys, setLocationKeys] = useState([]);
  const history = useHistory();
  useEffect(() => {
    return history.listen((location) => {
      if (history.action === "PUSH") {
        setLocationKeys([location.key]);
      }

      if (history.action === "POP") {
        if (locationKeys[1] === location.key) {
          setLocationKeys(([_, ...keys]) => keys);
          setIsLoaded(false);

          leaveMeeting();
          // Handle forward event
        } else {
          setLocationKeys((keys) => [location.key, ...keys]);
          href.push("/");
          setIsLoaded(false);

          leaveMeeting();

          // Handle back event
        }
      }
    });
  }, [locationKeys, history, href, leaveMeeting]);

  const onRecording = () => {
    let button = document.getElementById("record__button");
    button.classList.toggle("recording");
    props.call.recording();
  };

  const chatToggle = () => {
    chatShow ? setChatShow(false) : setChatShow(true);
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
        <div
          className="conference__container"
          ref={containerRef}
          onClick={onHideButtons}
        >
          {chatShow && (
            <div className="chat__block">
              <Chat
                chat={chat}
                dialog={chatId}
                messages={messages}
                chatHide={chatToggle}
                participants={participants}
              />
            </div>
          )}
          <div className="camera__block">
            <select
              className="view__changer"
              onChange={(e) => {
                props.call.viewChange(e.target.value);
              }}
            >
              <option value="grid">Grid</option>
              <option value="sidebar">Speaker view</option>
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
            <div className="user__buttons" ref={buttonsRef}>
              <div
                ref={devicesRef}
                id="user__devices"
                className="user__devices"
                onMouseLeave={onSwitchCamera}
              >
                {camName}
              </div>
              <button
                disabled={!isLoaded}
                type="button"
                ref={audioRef}
                onClick={onSetAudioMute}
                id="micro__btn"
                className={`call__btn micro__btn ${audioOff}`}
              >
                <img src="../img/mic.svg" alt="Micro" />
              </button>

              <button
                disabled={!isLoaded}
                className="chat__button"
                onClick={chatToggle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chat"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                </svg>
              </button>
              <button
                ref={videoRef}
                onClick={onSetVideoMute}
                disabled={!devices.video}
                id="video_btn"
                className={`call__btn video__btn ${isVideoMuted}`}
              >
                <img src="../img/video.svg" alt="Video" />
              </button>
              <button
                disabled={!isLoaded}
                id="end__btn"
                onClick={() => {
                  leaveMeeting().then(() => {
                    setIsLoaded(false);

                    href.push("/");
                  });
                }}
                className="call__btn end__btn"
              >
                <img src="../img/call_end.svg" alt="Call end" />
              </button>
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
                className={`call__btn share__btn ${isMobile ? `hide` : ``}`}
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
        </div>
      )}
    </div>
  );
};

export default Conference;
