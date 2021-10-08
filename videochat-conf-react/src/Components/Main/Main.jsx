
import "./Main.scss";
import React from "react";

import { NavLink } from "react-router-dom";
import AuthService from "../../services/auth-service";

const Main = () => {
  const onLogin = () => {
    const userName = prompt("Enter ur name", "Vasek");
    AuthService.login(userName);
  };
  return (
    <div className="container">
      <div className="img__container">
        <img src="./img/logo.png" alt="" />

      </div>

      <NavLink to="/conference" className="join" onClick={onLogin}>Join room as guest</NavLink>

    </div>
  );
};

export default Main;
