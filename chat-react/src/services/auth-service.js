import ConnectyCube from "connectycube";
//import CryptoJS from "crypto-js";

class AuthService {
  arr = [];
  constructor() {
    this.init();
  }

  init = () => {
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
    const defLogin = () => {
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

      ConnectyCube.init(credentials, appConfig);
    };
    const tokenLogin = (token) => {
      const CREDENTIALS = {
        appId: 1783,
        token: token.token,
      };
      ConnectyCube.init(CREDENTIALS, appConfig);
    };

    if (localStorage.token) {
      let token = JSON.parse(localStorage.token);
      let creationDate = new Date(token.timestamp);
      let creationHour = creationDate.getHours();
      let now = new Date().getHours();
      if (now - creationHour >= 2) {
        localStorage.removeItem("token");
        defLogin();
      } else {
        tokenLogin(token);
      }
    } else {
      defLogin();
    }
  };

  login = (login, password) => {
    const userCredentials = { login: login, password: password };
    return new Promise((resolve, reject) => {
      ConnectyCube.createSession(userCredentials)
        .then((session) => {
          if (!localStorage.token) {
            localStorage.setItem("login", login);
            let object = {
              token: session.token,
              timestamp: new Date().getTime(),
            };
            localStorage.setItem("token", JSON.stringify(object));
            localStorage.setItem("userId", session.user_id);
          }
          ConnectyCube.login(userCredentials)
            .then((user) => {
              resolve({ userInfo: user, password: password });
              alert("Logged in");
            })
            .catch((error) => {
              alert("Logged in");
            });
        })
        .catch((error) => {
          reject();
        });
    });
  };

  signup = (userName, login, password) => {
    return new Promise((resolve, reject) => {
      ConnectyCube.createSession().then((session) => {
        const userProfile = {
          login: login,
          full_name: userName,
          password: password,
        };

        ConnectyCube.users
          .signup(userProfile)
          .then((user) => {
            console.log("User Registrated");
            console.table(user);
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject();
          });
      });
    });
  };
}

const Auth = new AuthService();
export default Auth;
