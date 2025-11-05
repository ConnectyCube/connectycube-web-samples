import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import Loader from "./shared/Loader";
import { createUserSession, tryRestoreSession } from "./../connectycube";
import logo from "./../assets/logo.png";
import { useEffect, useRef, useState } from "react";

type FormValues = {
  login: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const isInited = useRef<boolean>(false);

  useEffect(() => {
    // use ref check to make it properly work with StrictMode
    if (!isInited.current) {
      isInited.current = true;

      tryRestoreSession().then((session) => {
        console.log("[Login] can auto restore? ", !!session);
        if (session) {
          navigate("/home");
        }
      });
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    try {
      await createUserSession(data.login, data.password);
      navigate("/home");
    } catch (e) {
      console.error("Login error", e);
      alert(JSON.stringify(e));
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
          placeholder="Login"
          {...register("login", {
            required: "Login is required",
          })}
          className="p-3 border border-gray-300 rounded-full bg-gray-200 text-black text-lg outline-none mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
          })}
          className="p-3 border border-gray-300 rounded-full bg-gray-200 text-black text-lg outline-none mb-2"
        />
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
          Login
        </button>
      </form>
      <div className="text-center">
        {isLoading && <Loader />}
        <p className="text-sm mb-1">Don't have an account?</p>
        <NavLink to="/signup" className="text-blue-500 hover:underline">
          Sign up
        </NavLink>
      </div>
    </div>
  );
};

export default Login;
