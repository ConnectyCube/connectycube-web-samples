import React from "react";
import { NavLink } from "react-router-dom";
import "./Login.scss";
import logo from "../../images/logo.png";
import Auth from "../../services/auth-service";
import { useHistory } from "react-router";
const Login = (props) => {
  const history = useHistory();

  const login = () => {
    const login = userLogin.current.value;
    const password = userPassword.current.value;
    Auth.login(login, password)
      .then((userCredentials) => {
        let chatCredentials = {
          userId: userCredentials.userInfo.id,
          password: { token: userCredentials.password },
        };
        props.chat.connectToChat(chatCredentials);
        history.push("/home");
      })
      .catch((error) => {
        console.log(error);
        alert("No such user");
      });
  };
  const userLogin = React.createRef();
  const userPassword = React.createRef();
  return (
    <div className="login__container">
      <div className="img__container">
        <img src={logo} alt="Logo" className="logo__img" />
      </div>
      <form action="#" className="login__form">
        <input ref={userLogin} type="text" placeholder="Login" />
        <input ref={userPassword} type="text" placeholder="Password" />
        <button type="button" onClick={login}>
          Login
        </button>
      </form>
      <div className="signup__block">
        <p>Don't have an account?</p>

        <NavLink to="signup">Sign up</NavLink>
      </div>
    </div>
  );
};

export default Login;
