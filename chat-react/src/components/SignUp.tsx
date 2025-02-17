import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { userSignup } from "./../connectycube";
import logo from "./../assets/logo.png";
import Loader from "./Shared/Loader";

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
    <div className="bg-gray-100 border border-black rounded-2xl flex flex-col items-center p-10">
      <div className="max-w-[200px] mb-6">
        <img src={logo} alt="Logo" className="w-full" />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-sm"
      >
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
          className="p-3 border border-gray-300 rounded-full bg-gray-200 text-black text-lg outline-none mb-2"
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
          className="p-3 border border-gray-300 rounded-full bg-gray-200 text-black text-lg outline-none mb-2"
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
              message: "Password cannot exceed 40 characters",
            },
          })}
          className="p-3 border border-gray-300 rounded-full bg-gray-200 text-black text-lg outline-none mb-2"
        />
        {errors.fullName && (
          <span className="text-red-500 text-sm">
            {errors.fullName.message}
          </span>
        )}
        {errors.login && (
          <span className="text-red-500 text-sm">{errors.login.message}</span>
        )}
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
        <button
          type="submit"
          className="rounded-full border border-black p-3 text-blue-900 bg-transparent shadow-none font-semibold transition duration-200 hover:bg-blue-800 hover:text-white hover:border-gray-100 mt-4 mb-5"
        >
          Register
        </button>
      </form>
      <div className="text-center">
        {isLoading && <Loader />}
        <p className="text-sm mb-1">Already have an account?</p>
        <NavLink to="/login" className="text-blue-500 hover:underline">
          Sign in
        </NavLink>
      </div>
    </div>
  );
};

export default SignUp;
