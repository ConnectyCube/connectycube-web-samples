import ConnectyCube from "connectycube";
import { appConfig, credentials } from "../config";

class AuthService {
  arr = [];

  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;
    }

    AuthService.instance = this;
  }

  init = () => {
    ConnectyCube.init(credentials, appConfig);

    if (localStorage.token) {
      ConnectyCube.setSession({ token: localStorage.token });
    }
  };


  login = async (login, password) => {
    try {
      const session = await ConnectyCube.createSession({ login, password });
      localStorage.setItem("login", login);
      localStorage.setItem("token", session.token);
      localStorage.setItem("userId", session.user_id);
      return { userInfo: session.user, password: password };
    } catch (error) {
      localStorage.clean();
      console.error(error);
    }
  };

  logout = async () => {
    try {
      await ConnectyCube.logout();
      localStorage.clean();
    } catch (error) {
      console.error(error);
    }
  };

  signup = async (full_name, login, password) => {
    try {
      await ConnectyCube.createSession(); // create empty session to register user
      await ConnectyCube.users.signup({ login, full_name, password }); // register user
      const session = await ConnectyCube.createSession({ login, password }); // create session for registered user
      localStorage.setItem("login", login);
      localStorage.setItem("token", session.token);
      localStorage.setItem("userId", session.user_id);
    } catch (error) {
      console.error(error);
    }
  };
}

export default new AuthService();
