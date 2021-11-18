import ConnectyCube from "connectycube";
import CryptoJS from "crypto-js";

class AuthService {
  arr = [];
  constructor() {
    this.init();
  }

  init = () => {
    const credentials = {
      appId: 1783,
      authKey: "EukGfBLUX5rvRVf",
      authSecret: "fJdkrThH-ebp6gV",
      chat: {
        streamManagement: {
          enable: true,
        },
      },
    };

    const appConfig = {
      debug: {
        mode: 1,
        conference: {
          server: "wss://janus.connectycube:8989",
        },
      },
      endpoints: {
        api: `apiaxia-dev.connectycube.com`,
        chat: `chataxia-dev.connectycube.com`,
      },
    };
    ConnectyCube.init(credentials, appConfig);
  };
  login = (login, password) => {
    const userCredentials = { login: login, password: password };
    return new Promise((resolve, reject) => {
      ConnectyCube.createSession(userCredentials)
        .then((session) => {
          ConnectyCube.login(userCredentials)
            .then((user) => {
              alert("Logged in");
            })
            .catch((error) => {
              alert("Logged in");
            });
          resolve();
        })
        .catch((error) => {
          reject();
        });
    });
  };
  connectToChat = (chatCredentials) => {
    ConnectyCube.chat
      .connect(chatCredentials)
      .then(() => {
        console.log("Connected", `chatConnection`);
      })
      .catch((error) => {
        console.log(`Failed connection due to ${error}`);
      });
  };
}

const Auth = new AuthService();
export default Auth;
