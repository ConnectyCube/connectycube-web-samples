import ConnectyCube from "connectycube";
import { appConfig, credentials } from "../config";

class AuthService {
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
      localStorage.clear();
      console.error(error);
    }
  };

  logout = async () => {
    try {
      await ConnectyCube.destroySession();
      localStorage.clear();
    } catch (error) {
      console.error(error);
    }
  };

  signup = async (full_name, login, password) => {
    await ConnectyCube.users.signup({ login, full_name, password }); // register user
    this.login(login, password);
  };
}

export default new AuthService();
