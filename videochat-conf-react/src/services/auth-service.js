import CryptoJS from "crypto-js";
import ConnectyCube from "connectycube";
import RUG from "random-username-generator";

class AuthService {
  constructor() {
    this.init();
  }

  init = () => {
    const credentials = {
      appId: process.env.REACT_APP_CONNECTYCUBE_APP_ID,
      authKey: process.env.REACT_APP_CONNECTYCUBE_AUTH_KEY,
      chat: {
        streamManagement: {
          enable: true,
        },
      },
    };

    const appConfig = {
      debug: {
        mode: 1,
      },
      conference: {
        server: process.env.REACT_APP_CONNECTYCUBE_MULTIPARTY_SERVER_ENDPOINT,
      },
      endpoints: {
        api: process.env.REACT_APP_CONNECTYCUBE_API_ENDPOINT,
        chat: process.env.REACT_APP_CONNECTYCUBE_CHAT_ENDPOINT,
      },
    };
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

const Auth = new AuthService();
export default Auth;
