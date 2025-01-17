import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import { useChat } from "@connectycube/use-chat";
import { createUserSession } from "../../connectycube";
import logo from "../../assets/logo.png";
import "./Login.scss";

const Login = () => {
  const { connect } = useChat();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const session = await createUserSession(login, password);

    const chatCredentials = {
      userId: session.user_id,
      password: password,
    };
    await connect(chatCredentials);

    navigate("/home");
  };

  const onEnterPress = (event: {
    keyCode: number;
    shiftKey: boolean;
    preventDefault: () => void;
  }) => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();

      handleLogin();
    }
  };

  return (
    <div className="login__container">
      <div className="img__container">
        <img src={logo} alt="Logo" className="logo__img" />
      </div>
      <form action="#" className="login__form" onKeyDown={onEnterPress}>
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleLogin}>
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
