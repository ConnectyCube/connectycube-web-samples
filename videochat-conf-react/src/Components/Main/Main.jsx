import "./Main.scss";
import React, { useContext } from "react";

import { NavLink } from "react-router-dom";
import AuthService from "../../services/auth-service";
import react from "react";
import CallService from "../../services/call-service";
import { UsersContext } from "../../UsersContext";
import Call from "../../services/call-service";

const Main = (props) => {
  const linkRef = react.createRef();
  //   let history = useHistory();
  //   history = history.location.pathname;
  // 	const PathCheck = () => {
  //     if (history.length < 7) {
  //       console.log("New room");

  //       // code to run on component mount
  //
  //         console.log("Sheesh");
  //       });
  //     } else {
  //       let roomId = history.split("/");
  // 		console.log(roomId)
  //       AuthService.login("").then(() => {
  //         // join
  //       });
  //     }
  //   };

  const [users, setUsers] = useContext(UsersContext);
  console.table(users);
  const onLogin = () => {
    const userName = prompt("Enter ur name", localStorage.userName);
    AuthService.login(userName).then((user, session) => {
      AuthService.arr.push(user.id, user.login, user.full_name);
      CallService.createAndJoinMeeting(
        user.id,
        user.login,
        user.full_name
      ).then((meetingId) => {
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
