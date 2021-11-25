import React from "react";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import "./JoinScreen.scss";
import { BsCameraVideo } from "react-icons/bs";

const JoinScreen = (props) => {
  const { onPrejoinFinish } = props;
  const videoRef = React.createRef();
  const userNameRef = React.createRef();
  const [isVideo, setIsVideo] = useState(true);
  const [stream, setStream] = useState(null);
  const [cameraBg, setCameraBg] = useState("");
  const [videoOff, setVideoOff] = useState(false);
  const href = useHistory();
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: isVideo })
      .then((stream) => {
        setStream(stream);
      })
      .catch((error) => {
        setIsVideo(false);
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: false })
          .then((stream) => {
            setVideoOff(true);
            setStream(stream);
          })
          .catch((error) => {
            alert("No connected devices or permission denied");
            href.push({
              pathname: "/",
            });
          });

        setCameraBg("show");
      });
  }, [isVideo, href]);

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
    userNameRef.current.value.trim()
      ? onPrejoinFinish(userNameRef.current.value, isVideo, true)
      : alert("Enter your name");
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

  const onSetVideoMute = () => {
    videoRef.current.classList.toggle("mute");
    let cameraBg = document.getElementById("camera__bg");
    cameraBg.classList.toggle("show");
    let cam = document.getElementById("user__cam");
    cam.classList.toggle("muted");
    stream.getTracks().forEach((t) => t.stop());
    isVideo ? setIsVideo(false) : setIsVideo(true);
  };

  return (
    <form onSubmit={formSend} className="join__form">
      <div className="video__container">
        <div className="buttons" id="buttons">
          <button
            disabled={videoOff}
            type="button"
            ref={videoRef}
            onClick={onSetVideoMute}
            id="video_btn"
            className="call__btn video__btn-prejoin"
          >
            <BsCameraVideo size={24} style={{ fill: `white` }} />
          </button>
        </div>
        <div className="lds-dual-ring"></div>
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
        <input
          ref={userNameRef}
          type="text"
          placeholder="Enter your name"
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
