import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../images/logo.png";
import Auth from "../../services/auth-service";
import { useNavigate } from "react-router";
import ChatContext from "../../services/chat-service";
import "./Login.scss";

const Login = () => {
  const {connectToChat} = useContext(ChatContext);
  const navigate = useNavigate();
  
  const login = () => {
    const login = userLogin.current.value;
    const password = userPassword.current.value;
    Auth.login(login, password)
      .then((userCredentials) => {
        let chatCredentials = {
          userId: userCredentials.userInfo.id,
          password: userCredentials.password,
        };
        connectToChat(chatCredentials);
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
        alert("No such user");
      });
  };

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();

      login();
    }
  };
  const userLogin = React.createRef();
  const userPassword = React.createRef();
  return (
    <div className="login__container">
      <div className="img__container">
        <img src={logo} alt="Logo" className="logo__img" />
      </div>
      <form action="#" className="login__form" onKeyDown={onEnterPress}>
        <input ref={userLogin} type="text" placeholder="Login" />
        <input ref={userPassword} type="password" placeholder="Password" />
        <button type="button" onClick={login}>
          Login
        </button>
      </form>
      <div className="signup__block">
        <p>Don't have an account?</p>
        <NavLink to="/signup">Sign up</NavLink>
      </div>
    </div>
  );
};

export default Login;
