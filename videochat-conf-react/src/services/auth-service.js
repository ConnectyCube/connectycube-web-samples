import CryptoJS from "crypto-js";
import ConnectyCube from "connectycube";

class AuthService {
  arr = [];
  constructor() {
    this.init();
  }

  init = () => {
    const credentials = {
      appId: REPLACE_APP_ID,
      authKey: 'REPLACE_APP_AUTH_KEY',
      authSecret: 'REPLACE_APP_AUTH_SECRET',
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
        server: 'wss://REPLACE_APP_JANUS_DOMAIN:8989',
      },
      endpoints: {
        api: 'REPLACE_APP_API_DOMAIN',
        chat: 'REPLACE_APP_CHAT_DOMAIN',
      },
    };
    ConnectyCube.init(credentials, appConfig);
  };
  connectToChat = (chatCredentials) => {
    return ConnectyCube.chat.connect(chatCredentials);
  };
  login(userName) {
    return new Promise((resolve, reject) => {
      ConnectyCube.createSession()
        .then((session) => {
          if (!userName) {
            ConnectyCube.destroySession().catch((error) => {});
          } else if (localStorage.getItem("userName") === userName) {
            const userCredentials = {
              login: localStorage.getItem("userLogin"),
              password: localStorage.getItem("userPass"),
            };

            ConnectyCube.login(userCredentials)
              .then((user) => {
                const chatCredentials = {
                  userId: user.id,
                  password: userCredentials.password,
                };
                this.connectToChat(chatCredentials).then(() => {
                  resolve(user);
                });
              })
              .catch((error) => {
                console.log(error);
                reject();
              });
          } else {
            const rug = require("random-username-generator");
            const new_username = rug.generate();
            const userProfile = {
              login: new_username,
              password: CryptoJS.MD5(new_username).toString(),
              full_name: userName,
            };
            ConnectyCube.users
              .signup(userProfile)
              .then((user) => {
                localStorage.setItem("userName", userName);
                localStorage.setItem("userPass", userProfile.password);
                localStorage.setItem("userLogin", userProfile.login);
                const userCredentials = {
                  login: userProfile.login,
                  password: userProfile.password,
                };
                ConnectyCube.login(userCredentials)
                  .then((user) => {
                    const chatCredentials = {
                      userId: user.id,
                      password: userCredentials.password,
                    };

                    this.connectToChat(chatCredentials).then(() => {
                      resolve(user);
                    });
                  })
                  .catch((error) => {});
              })
              .catch((error) => {});
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
}
const Auth = new AuthService();
export default Auth;
