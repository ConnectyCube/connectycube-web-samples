import ConnectyCube from "connectycube";
// import CryptoJS from "crypto-js";

class AuthService {
  arr = [];
  constructor() {
    this.init();
    this.wasLogged();
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
  wasLogged() {
    if (localStorage.password) {
      this.login(localStorage.login, localStorage.password);
    }
  }

  login = (login, password) => {
    const userCredentials = { login: login, password: password };
    return new Promise((resolve, reject) => {
      ConnectyCube.createSession(userCredentials)
        .then((session) => {
          ConnectyCube.login(userCredentials)
            .then((user) => {
              localStorage.setItem("login", login);
              localStorage.setItem("password", password);

              alert("Logged in");
              resolve();
            })
            .catch((error) => {
              alert("Error while logging");
              reject();
            });
        })
        .catch((error) => {
          reject();
        });
    });
  };

  register = (login, password, name) => {
    return new Promise((resolve, reject) => {
      const userCredentials = {
        login: login,
        password: password,
        full_name: name,
      };
      ConnectyCube.createSession().then((session) => {
        ConnectyCube.users
          .signup(userCredentials)
          .then((user) => {
            localStorage.setItem({ login: login, password: password });
            alert("Registred");
            resolve();
            console.log("REGISTRATED");
          })
          .catch((error) => {
            error.info.errors.password
              ? alert(error.info.errors.password)
              : error.info.errors.login
              ? alert(error.info.errors.login)
              : alert(error.info.errors.base);
            console.log(error.info.errors);
            reject();
          });
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
