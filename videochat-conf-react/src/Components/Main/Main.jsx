import "./Main.scss";
import React from "react";

import AuthService from "../../services/auth-service";
import { useHistory } from "react-router";
const Main = (props) => {
  let href = useHistory();
  const onLogin = () => {
    const userName = prompt("Enter your name", localStorage.userName);
    AuthService.login(userName).then((user) => {
      props.call
        .createAndJoinMeeting(user.id, user.login, user.full_name, "user__cam")
        .then((state) => {
          const confRoomIdHash = btoa(state.meetingId);
          href.push(`join/${confRoomIdHash}`);
          href.location.state = "Creator";
        })
        .catch((error) => {
          alert(error);
          href.location.pathname = "/";
        });
    });
  };
  return (
    <div className="container">
      <div className="img__container">
        <img src="./img/logo.png" alt="" />
      </div>
      <button className="join" onClick={onLogin}>
        Join room as guest
      </button>
    </div>
  );
};

export default Main;
