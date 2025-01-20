import { credentials, appConfig } from "./config";
import RUG from "random-username-generator";
import CryptoJS from "crypto-js";
import ConnectyCube from "connectycube";

class AuthService {
  init = (janusServerEndpoint = null) => {
    if (janusServerEndpoint) {
      appConfig.conference.server = janusServerEndpoint;
    }
    ConnectyCube.init(credentials, appConfig);
  };

  async login(userName) {
    const login = localStorage.getItem("userLogin") || RUG.generate();
    const userProfile = {
      login,
      password: CryptoJS.MD5(login).toString(),
      full_name: userName,
    };

    const session = await ConnectyCube.createSession(userProfile);
    const user = session.user;

    if (userName !== user.full_name) {
      await ConnectyCube.users.update({ full_name: userName });
    }

    const chatCredentials = {
      userId: user.id,
      password: userProfile.password,
    };
    await ConnectyCube.chat.connect(chatCredentials);

    localStorage.setItem("userName", userName);
    localStorage.setItem("userLogin", userProfile.login);

    return user;
  }
}

// create instance
const Auth = new AuthService();
// lock instance
Object.freeze(Auth);

export default Auth;
