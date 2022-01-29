import {Injectable} from '@angular/core';
import {CommonUtilities} from "../utilities/common.utilities";
import ConnectyCube from "connectycube";

// declare let ConnectyCube: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
  }

  private login(userProfileLogin: object) {
    return ConnectyCube.login(userProfileLogin);
  }

  public init(CREDENTIALS: object, appConfig: object) {
    ConnectyCube.init(CREDENTIALS, appConfig);
  }

  private connectToChat(userCredentials: any) {
    return ConnectyCube.chat.connect(userCredentials)
      .then(() => {
        console.log("Connect To Chat");
      })
      .catch((error: any) => {
        console.error("Connect to chat Error!", error);
      })
  }

  public auth(userName: string) {
    return new Promise<any>((resolve, reject) => {

      ConnectyCube.createSession().then((session: any) => {
        const login: string = CommonUtilities.randomLogin() + CommonUtilities.randomLogin();
        const password: string = CommonUtilities.hashCode(login);

        const userProfile = {
          login: login,
          password: password,
          full_name: userName,
        };
        const userLocalStorage = {
          login: localStorage.getItem('login'),
          password: localStorage.getItem('password'),
          full_name: localStorage.getItem('userName'),
        };
        const userProfileLogin = {
          login: userProfile.login,
          password: userProfile.password
        }

        if (localStorage.getItem('userName')) {
          this.login(userLocalStorage)
            .then((user: any) => {
              if (userName !== localStorage.getItem('userName')) {
                localStorage.setItem('userName', userName);
                ConnectyCube.users
                  .update({full_name: userName});
              }
              console.log("logging user", user);
              this.connectToChat({userId: user.id, password: userLocalStorage.password})
                .then(() => {
                  resolve(user.id)
                });

            })
            .catch((error: any) => {
              console.log('LoginError!', error);
              reject();
            })
          return;
        }

        localStorage.setItem('login', login)
        localStorage.setItem('password', password)
        localStorage.setItem('userName', userName)

        ConnectyCube.users.signup(userProfile)
          .then(() => {
            this.login(userProfileLogin)
              .then((user: any) => {
                console.log("logging user", user);
                this.connectToChat({userId: user.id, password: password})
                  .then(() => {
                    resolve(user.id)
                  });
              })
              .catch((error: any) => {
                console.log('LoginError!', error);
                reject();
              })
          })
          .catch((error: any) => {
            try {
              const IsRegisteredUser: boolean = error.info.errors.base.includes("login must be unique");

              if (IsRegisteredUser) {
                this.login(userProfileLogin)
                  .then((user: any) => {
                    console.log("logging user", user);
                    this.connectToChat({userId: user.id, password: password})
                      .then(() => {
                        resolve(user.id)
                      });
                  })
                  .catch((error: any) => {
                    console.log('LoginError!', error);
                    reject();
                  })
              }
              else {
                console.log("signUpError", error);
                reject();
              }
            }
            catch {
              console.log(error);
              reject();
            }
          })

      });
    })
  }
}
