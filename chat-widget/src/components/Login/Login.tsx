import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { useChat } from "@connectycube/use-chat";
import Loader from "../Shared/Loader";
import { createUserSession } from "../../connectycube";
import logo from "../../assets/logo.png";
import "./Login.scss";
import { useState } from "react";

type FormValues = {
  login: string;
  password: string;
};

const Login = () => {
  const { connect } = useChat();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    try {
      const session = await createUserSession(data.login, data.password);

      const chatCredentials = {
        userId: session.user_id,
        password: session.token,
      };
      await connect(chatCredentials);

      navigate("/home");
    } catch (e) {
      console.error("Login error", e);
      alert(JSON.stringify(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login__container">
      <div className="img__container">
        <img src={logo} alt="Logo" className="logo__img" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="login__form">
        <input
          type="text"
          placeholder="Login"
          {...register("login", {
            required: "Login is required",
          })}
        />
        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
          })}
        />
        {errors.login && <span className="error">{errors.login.message}</span>}
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
        <button type="submit">Login</button>
      </form>
      <div className="signup__block">
        {isLoading && <Loader />}
        <p>Don't have an account?</p>
        <NavLink to="/signup">Sign up</NavLink>
      </div>
    </div>
  );
};

export default Login;
