import React, { createRef } from "react";
import { useCallback } from "react";
import { useEffect, useState } from "react/cjs/react.development";
import "./JoinScreen.scss";

const JoinScreen = (props) => {
  const { onPrejoinFinish, toggleAudio, toggleVideo } = props;
  const audioRef = React.createRef();
  const videoRef = React.createRef();
  const userNameRef = React.createRef();
  const [isAudio, setIsAudio] = useState(true);
  const [isVideo, setIsVideo] = useState(true);
  const [stream, setStream] = useState(null);
  const [cameraBg, setCameraBg] = useState("");
  const [videoOff, setVideoOff] = useState();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: isAudio, video: isVideo })
      .then((stream) => {
        setStream(stream);
        setVideoOff(false);
      })
      .catch((error) => {
        alert(error);
        setIsVideo(false);
        navigator.mediaDevices
          .getUserMedia({ audio: isAudio, video: false })
          .then((stream) => {
            setStream(stream);
          });
        setVideoOff(true);
        setCameraBg("show");
      });
  }, [isVideo]);

  useEffect(() => {
    if (stream) {
      return () => {
        stream.getTracks().forEach((t) => t.stop());
      };
    }
  }, [stream]);

  const formSend = (e) => {
    e.preventDefault();
  };
  const login = () => {
    onPrejoinFinish(userNameRef.current.value, isVideo, isAudio);
  };
  const preScreenRef = useCallback(
    (videoElement) => {
      if (!stream || !videoElement) {
        return;
      }

      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = function (e) {
        videoElement.play();
      };
      document.getElementById("buttons").style.opacity = "100%";
      document.getElementById("form__info").style.opacity = "100%";
    },

    [stream]
  );
  const onSetAudioMute = () => {
    audioRef.current.classList.toggle("mute");
    isAudio ? setIsAudio(false) : setIsAudio(true);
    // toggleAudio();
  };
  const onSetVideoMute = () => {
    videoRef.current.classList.toggle("mute");
    let cameraBg = document.getElementById("camera__bg");
    cameraBg.classList.toggle("show");
    let cam = document.getElementById("user__cam");
    cam.classList.toggle("muted");
    stream.getTracks().forEach((t) => t.stop());
    isVideo ? setIsVideo(false) : setIsVideo(true);
    //toggleVideo();
  };

  return (
    <form onSubmit={formSend} className="join__form">
      <div className="video__container">
        <div className="buttons" id="buttons">
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
            disabled={videoOff}
            type="button"
            ref={videoRef}
            onClick={onSetVideoMute}
            //   disabled={!video}
            id="video_btn"
            className="call__btn video__btn"
          >
            <img src="../img/video.svg" alt="Video" />
          </button>
        </div>
        <video
          muted={true}
          playsInline
          id="user__cam"
          className={`user__cam`}
          preload="yes"
          ref={preScreenRef}
        ></video>
        <div id="camera__bg" className={`camera__bg ${cameraBg}`}></div>
      </div>

      <div id="form__info" className="form__info">
        <div>Enter your name</div>
        <input
          ref={userNameRef}
          type="text"
          placeholder="James"
          name="userName"
        />
        <button onClick={login} type="submit">
          Join Room
        </button>
      </div>
    </form>
  );
};

export default JoinScreen;
