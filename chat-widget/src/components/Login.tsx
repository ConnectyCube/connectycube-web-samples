import { useEffect } from "react";
import { useNavigate } from "react-router";
import Loader from "./shared/loader";
import { createFingerprintSession } from "../connectycube";
import logo from "./../assets/logo.png";

type LoginProps = {
  userFullName?: string;
  userId?: string;
};

const Login: React.FC<LoginProps> = ({userFullName, userId}) => {
  const navigate = useNavigate();

  useEffect(() => {
    autoLogin();
  }, []);

  const autoLogin = async () => {
    try {
      await createFingerprintSession(userFullName, userId);
      navigate("/home");
    } catch (e) {
      console.error("Login error", e);
      alert(JSON.stringify(e));
    }
  }

  return (
    <div className="bg-gray-100 border border-black rounded-2xl flex flex-col items-center p-4">
      <div className="max-w-[200px] mb-2">
        <img src={logo} alt="Logo" className="w-full" />
      </div>
      <Loader />
    </div>
  );
};

export default Login;
