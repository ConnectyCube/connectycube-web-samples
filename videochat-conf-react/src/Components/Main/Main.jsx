import "./Main.scss";
import React from "react";

import { useHistory } from "react-router";
const Main = (props) => {
  let href = useHistory();
  const startMeeting = () => {
    href.push(`join/`, { state: "Creator" });
  };

  return (
    <div className="container">
      <div className="img__container">
        <img src="./img/logo.png" alt="" />
      </div>
      <button className="join" onClick={startMeeting}>
        Start meeting
      </button>
    </div>
  );
};

export default Main;
