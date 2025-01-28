import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { userSignup } from "../../connectycube";
import logo from "../../assets/logo.png";
import Loader from "../Shared/Loader";
import "./SignUp.scss";

type FormValues = {
  fullName: string;
  login: string;
  password: string;
};

const SignUp = () => {
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
      await userSignup(data.fullName, data.login, data.password);
      navigate("/home");
    } catch (e: any) {
      console.error("SignUp error", e);
      alert(e.info.errors.base);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup__container">
      <div className="img__container">
        <img src={logo} alt="Logo" className="logo__img" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="signup__form">
        <input
          type="text"
          placeholder="Full name"
          {...register("fullName", {
            required: "Full name is required",
            minLength: {
              value: 1,
              message: `Minimum length is ${1} character`,
            },
            maxLength: {
              value: 200,
              message: "Full name cannot exceed 200 characters",
            },
          })}
        />
        <input
          type="text"
          placeholder="Login"
          {...register("login", {
            required: "Login is required",
            minLength: {
              value: 3,
              message: `Minimum length is ${3} characters`,
            },
            maxLength: {
              value: 70,
              message: "Login cannot exceed 70 characters",
            },
          })}
        />
        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: `Minimum length is ${6} characters`,
            },
            maxLength: {
              value: 40,
              message: "Login cannot exceed 40 characters",
            },
          })}
        />
        {errors.fullName && (
          <span className="error">{errors.fullName.message}</span>
        )}
        {errors.login && <span className="error">{errors.login.message}</span>}
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
        <button type="submit">Register</button>
      </form>
      <div className="login__block">
        {isLoading && <Loader />}
        <p>Already have an account?</p>
        <NavLink to="/login">Sign in</NavLink>
      </div>
    </div>
  );
};

export default SignUp;
