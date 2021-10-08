import React from "react";
import { NavLink } from "react-router-dom";
import UserCam from "../UserCam/UserCam";
import "./Conference.scss";
import AuthService from "../../services/auth-service";
import Call from "../../services/call-service";

const Conference = (props) => {
  const allCam = [];
  for (let i = 0; i < props.participants; i += 1) {
    allCam.push(<UserCam key={i} participant={props.participants} />);
  }
  return (
    <div className="conference">
      <div className={`users__cams flex-${props.participants}`}>
        {allCam}

      </div>
      <div className="user__buttons">
        <button type="button" onClick={Call.setAudioMute} id="micro__btn" className="call__btn micro__btn"><img src="./img/mic.svg" alt="Micro" /></button>
        <button id="video_btn" className="call__btn video__btn"><img src="./img/video.svg" alt="Video" /></button>
        <NavLink to="/" id="end__btn" onClick={AuthService.logout} className="call__btn end__btn"><img src="./img/call_end.svg" alt="Call end" /></NavLink>
        <button id="switch__btn" className="call__btn switch__btn"><img src="./img/switch_video.svg" alt="Switch" /></button>
        <button id="share__btn" className="call__btn share__btn"><img src="./img/share.svg" alt="Share" /></button>
      </div>

    </div>
  );
};

export default Conference;
