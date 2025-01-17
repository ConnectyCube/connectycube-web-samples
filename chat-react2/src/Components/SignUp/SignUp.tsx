import { useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { userSignup } from "../../connectycube";
import logo from "../../assets/logo.png";
import "./SignUp.scss";

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    await userSignup(name, login, password);

    navigate("/home");
  };

  const onEnterPress = (event: {
    keyCode: number;
    shiftKey: boolean;
    preventDefault: () => void;
  }) => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();

      handleSignUp();
    }
  };

  return (
    <div className="signup__container">
      <div className="img__container">
        <img src={logo} alt="Logo" className="logo__img" />
      </div>
      <form action="#" className="signup__form" onKeyDown={onEnterPress}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button type="button" onClick={handleSignUp}>
          Register
        </button>
      </form>
      <div className="login__block">
        <p>Already have an account?</p>
        <NavLink to="/login">Sign in</NavLink>
      </div>
    </div>
  );
};

export default SignUp;
