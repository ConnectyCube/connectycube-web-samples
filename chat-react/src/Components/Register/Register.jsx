import React from "react";
import { NavLink } from "react-router-dom";
import "./Register.scss";
import { useHistory } from "react-router";
import logo from "../../images/logo.png";
import Auth from "../../services/auth-service";

const Register = () => {
  const history = useHistory();
  const register = () => {
    const login = userLogin.current.value;
    const password = userPassword.current.value;
    const name = userName.current.value;
    Auth.register(login, password, name)
      .then(() => {
        alert("User registrated ");
        history.push("/home");
      })
      .catch(() => {
        alert("Problems");
      });
  };
  const userLogin = React.createRef();
  const userPassword = React.createRef();
  const userName = React.createRef();
  return (
    <div className="register__container">
      <div className="img__container">
        <img src={logo} alt="Logo" className="logo__img" />
      </div>
      <form action="#" className="register__form">
        <input ref={userName} type="text" placeholder="Name" />
        <input ref={userLogin} type="text" placeholder="Login" />
        <input ref={userPassword} type="password" placeholder="Password" />
        <button type="button" onClick={register}>
          Register
        </button>
      </form>
      <div className="signup__block">
        <p>Already have an account?</p>

        <NavLink to="/">Login</NavLink>
      </div>
    </div>
  );
};

export default Register;
