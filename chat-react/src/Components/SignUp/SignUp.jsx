import React from "react";
import { NavLink } from "react-router-dom";
import "./SignUp.scss";
import logo from "../../images/logo.png";
import Auth from "../../services/auth-service";
import { useHistory } from "react-router";

const SignUp = () => {
  const history = useHistory();

  const signUp = () => {
    const userName = userNameRef.current.value;
    const login = userLoginRef.current.value;
    const password = userPasswordRef.current.value;
    userNameRef.current.value = "";
    userLoginRef.current.value = "";
    userPasswordRef.current.value = "";
    Auth.signup(userName, login, password)
      .then(() => {
        history.push("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onEnterPress = (e) => {
  
    if (e.keyCode === 13 && e.shiftKey === false) {
		e.preventDefault();
      signUp();
    }
  };
  const userNameRef = React.createRef();
  const userLoginRef = React.createRef();
  const userPasswordRef = React.createRef();
  return (
    <div className="signup__container">
      <div className="img__container">
        <img src={logo} alt="Logo" className="logo__img" />
      </div>
      <form action="#" className="signup__form" onKeyDown={onEnterPress}>
        <input ref={userNameRef} type="text" placeholder="Name" />
        <input ref={userLoginRef} type="text" placeholder="Login" />
        <input ref={userPasswordRef} type="password" placeholder="Password" />
        <button type="button" onClick={signUp}>
          Registrate
        </button>
      </form>
      <div className="login__block">
        <p>Already have an account?</p>
        <NavLink to="/">Sign in</NavLink>
      </div>
    </div>
  );
};

export default SignUp;
