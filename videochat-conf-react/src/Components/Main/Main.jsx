import "./Main.scss";
import React, { useContext } from "react";

import { NavLink } from "react-router-dom";
import AuthService from "../../services/auth-service";
import react from "react";
import CallContext from "../../services/call-service-2";

const Main = (props) => {

  const linkRef = react.createRef();
  const onLogin = () => {
    const userName = prompt("Enter ur name", localStorage.userName);
    AuthService.login(userName).then((user, session) => {
      props.call
        .createAndJoinMeeting(user.id, user.login, user.full_name)
        .then((meetingId) => {
          const confRoomIdHash = btoa(meetingId);
          window.history.replaceState(
            {},
            "Conference Guest Room",
            `/join/${confRoomIdHash}`
          );
        });
    });
  };

  return (
    <div className="container">
      <div className="img__container">
        <img src="./img/logo.png" alt="" />
      </div>
      <NavLink ref={linkRef} to={`/join/`} className="join" onClick={onLogin}>
        Join room as guest
      </NavLink>
    </div>
  );
};

export default Main;
