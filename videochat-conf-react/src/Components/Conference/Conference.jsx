import React, { useState, useEffect, useContext } from "react";
import UserStream from "./UserCam/UserStream";
import "./Conference.scss";
import AuthService from "../../services/auth-service";
import react from "react";
import Devices from "./Devices/Devices";
import JoinScreen from "../JoinScreen/JoinScreen";
import { isiOS, detectBrowser } from "../../services/heplers";

import { useHistory } from "react-router";
import Chat from "./Chat/Chat";
import ChatContext from "../../services/chat-service";
import { FaMicrophone } from "react-icons/fa";
import { IoMdVideocam } from "react-icons/io";
import { MdScreenShare, MdCameraswitch, MdCallEnd } from "react-icons/md";
import { BsFillChatDotsFill } from "react-icons/bs";

const Conference = (props) => {
  const chat = useContext(ChatContext);
  let href = useHistory();
  chat.chatCallbaсks();
  const [chatShow, setChatShow] = useState(false);
  const [preJoinScreen, setPreJoinScreen] = useState(true);
  const [audioOff, setAudioOff] = useState("");
  const {
    isCreator,
    toggleVideo,
    toggleAudio,
    devices,
    isMobile,
    isLoaded,
    messages,
    isSharing,

    leaveMeeting,
    isVideoMuted,
    participants,
    mirror,
  } = props.call;

  let [chatId, setChatId] = useState("");
  
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
            chat.joinChat(state.meetingId, participants).then((chat) => {
              setChatId(chat._id);
            });
            const confRoomIdHash = btoa(state.meetingId);
            href.push(`${confRoomIdHash}`, "Creator");

            if (!isAudio) {
              setAudioOff(`mute`);
            }
          })
          .catch((error) => {
            alert(error);
            href.location.pathname = "/";
          });
      });
    } else {
      setPreJoinScreen(false);
      const history = window.location.pathname;
      let roomId = history.split("/");
      roomId = atob(roomId[2]);
      AuthService.login(userName).then((user) => {
        props.call
          .joinMeeting(
            user.full_name,
            roomId,
            user.id,
            `user__cam`,
            isVideo,
            isAudio
          )
          .then((devices) => {
            chat.joinChat(roomId).then((chat) => {
              setChatId(chat._id);
            });
          })
          .catch((error) => {
            console.error(error);
          });
      });

      if (!isAudio) {
        setAudioOff(`mute`);
      }
    }
  };

  useEffect(() => {
    chat.setParticipants(participants);
  }, [participants, chat]); //Chat dependecies maybe can be delete

  let camName = [];
  const newDevice = (e) => {
    e.stopPropagation();
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
    let currentElem = document.getElementById(`fullscreen-stream-${userId}`);

    if (currentElem.requestFullscreen) {
      currentElem.requestFullscreen();
    } else if (currentElem.mozRequestFullScreen) {
      /* Firefox */
      currentElem.mozRequestFullScreen();
    } else if (currentElem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      currentElem.webkitRequestFullscreen();
    } else if (currentElem.msRequestFullscreen) {
      /* IE/Edge */
      currentElem.msRequestFullscreen();
    } else {
      alert(`Error attempting to enable full-screen mode`);
    }
  };
  let speakerUser;
  let usersSortedById;
  if (props.call.view === "sidebar" && participants.length > 1) {
    let usersSortedByMicLevel = [...props.call.participants].sort((a, b) => {
      if (a.micLevel < b.micLevel) {
        return -1;
      }
      if (a.micLevel > b.micLevel) {
        return 1;
      }
      return 0;
    });
    console.table(usersSortedByMicLevel);

    speakerUser = usersSortedByMicLevel[usersSortedByMicLevel.length - 1];

    usersSortedById = [...props.call.participants].sort((a, b) => {
      if (a.userId < b.userId && a.userName === "me") {
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
            isMicroMuted={props.call.participants[i].isMicroMuted}
            isVideo={props.call.participants[i].isVideo}
            streamNumber={i}
            userId={user.name === "me" ? "me" : user.userId}
            userName={user.name}
            stream={user.stream}
            fullScreen={fullScreen}
            bitrate={props.call.participants[i].bitrate}
            micLevel={props.call.participants[i].micLevel}
            isMobile={props.call.isMobile}
            connectionStatus={props.call.participants[i].connectionStatus}
            mirror={mirror}
            isSharing={props.call.participants[i].isSharing}
          />
        );
      } else {
        props.call.speakerStream(user.userId);

        speakerUser = (
          <UserStream
            isMicroMuted={user.isMicroMuted}
            isVideo={props.call.participants[i].isVideo}
            userId={user.name}
            userName={user.name}
            stream={user.stream}
            fullScreen={fullScreen}
            isSharing={isSharing}
            bitrate={props.call.participants[i].bitrate}
            micLevel={props.call.participants[i].micLevel}
            isMobile={props.call.isMobile}
            connectionStatus={props.call.participants[i].connectionStatus}
          />
        );
      }
    }
  } else {
    for (let i = 0; i < props.call.participants.length; i += 1) {
      let user = props.call.participants[i];

      usersStreams.push(
        <UserStream
          isMicroMuted={user.isMicroMuted}
          key={i}
          isSharing={user.isSharing}
          isVideo={user.isVideo}
          streamNumber={i}
          userId={user.name === "me" ? "me" : user.userId}
          userName={user.name}
          stream={user.stream}
          fullScreen={fullScreen}
          bitrate={user.bitrate}
          micLevel={user.micLevel}
          isMobile={isMobile}
          mirror={mirror}
          connectionStatus={user.connectionStatus}
        />
      );
    }
  }
  const containerRef = react.createRef();
  const audioRef = react.createRef();
  const videoRef = react.createRef();
  const buttonsRef = react.createRef();

  const onSetAudioMute = (e) => {
    e.stopPropagation();
    audioRef.current.classList.toggle("mute");
    props.call.toggleAudio();
  };

  const onSetVideoMute = (e) => {
    e.stopPropagation();

    videoRef.current.classList.toggle("mute");

    props.call.toggleVideo();
  };

  const onSwitchCamera = (e) => {
    e.stopPropagation();

    let devices = document.getElementById("user__devices");
    devices.classList.toggle("active");
  };
  const onHideButtons = (e) => {
    let classOfClick = e.currentTarget.className;
    let target = e.target.tagName;
    if (
      classOfClick === "conference__container" &&
      target !== "TEXTAREA" &&
      target !== "SELECT"
    ) {
      let btns = buttonsRef.current;
      btns.classList.toggle("hide");
    }
  };

  const onStartScreenSharing = (e) => {
    e.stopPropagation();

    if (mirror) {
      props.call.stopSharingScreen();
    } else {
      props.call.startScreenSharing();
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

          leaveMeeting();
          // Handle forward event
        } else {
          setLocationKeys((keys) => [location.key, ...keys]);
          href.push("/");

          leaveMeeting();

          // Handle back event
        }
      }
    });
  }, [locationKeys, history, href, leaveMeeting]);

  const onRecording = (e) => {
    e.stopPropagation();

    let button = document.getElementById("record__button");
    button.classList.toggle("recording");
    props.call.recording();
  };

  const chatToggle = (e) => {
    e.stopPropagation();

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
          id="conference__container"
          className="conference__container"
          ref={containerRef}
          onClick={onHideButtons}
        >
          {chatShow && (
            <div className="chat__block">
              <Chat
                chat={chat}
                dialogId={chatId}
                messages={messages}
                chatHide={chatToggle}
                participants={participants}
              />
            </div>
          )}
          <div className="camera__block">
            <select
              className="view__changer"
              disabled={detectBrowser() === "Safari" || isiOS()}
              onChange={(e) => {
                e.stopPropagation();
                props.call.viewChange(e.target.value);
              }}
            >
              <option value="grid">Grid</option>
              <option value="sidebar">Speaker view</option>
            </select>
            <div
              className={`streams_container ${
                participants.length > 1 ? props.call.view : "grid"
              }`}
            >
              {props.call.view === "sidebar" && (
                <div className={"speaker-stream"} id="speakerStream">
                  {speakerUser}
                </div>
              )}
              <div
                className={`users__cams ${
                  participants.length > 1 ? props.call.view : "grid"
                } ${participants.length > 1 ? props.call.view : "grid"}-${
                  props.call.participants.length
                }`}
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
                <FaMicrophone
                  size={32}
                  style={{ fill: "white", opacity: 0.9 }}
                />
              </button>

              <button
                disabled={!isLoaded}
                className="chat__button"
                onClick={chatToggle}
              >
                <BsFillChatDotsFill size={32} style={{ fill: "white" }} />
              </button>
              <button
                ref={videoRef}
                onClick={onSetVideoMute}
                disabled={!devices.video}
                id="video_btn"
                className={`call__btn video__btn ${isVideoMuted}`}
              >
                <IoMdVideocam
                  size={32}
                  style={{ fill: "white", opacity: 0.9 }}
                />
              </button>
              <button
                disabled={!isLoaded}
                id="end__btn"
                onClick={() => {
                  leaveMeeting().then(() => {
                    href.push("/");
                  });
                }}
                className="call__btn end__btn"
              >
                <MdCallEnd size={32} style={{ fill: `white` }} />
              </button>
              <button
                disabled={!devices.video}
                onClick={onSwitchCamera}
                id="switch__btn"
                className="call__btn switch__btn"
              >
                <MdCameraswitch size={32} style={{ fill: `white` }} />
              </button>
              <button
                onClick={onStartScreenSharing}
                id="share__btn"
                className={`call__btn share__btn ${isMobile ? `hide` : ``} ${
                  mirror ? "sharing" : ""
                }`}
                disabled={props.call.isMobile ? true : false}
              >
                <MdScreenShare size={32} style={{ fill: `white` }} />
              </button>
              <button
                onClick={onRecording}
                id="record__button"
                className={`record__button ${isCreator}`}
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conference;
