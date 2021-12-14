import {Injectable} from '@angular/core';

declare let ConnectyCube: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
  }

  public login(login: string, password: string, isLogin?: boolean) {
    const userProfileLogin = {
      login: login,
      password: password
    }

    if (isLogin) {
      return ConnectyCube.createSession().then(() => {
        return ConnectyCube.login(userProfileLogin);
      })
    }
    else {
      return ConnectyCube.login(userProfileLogin);
    }

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

  public auth(userName: string, login: string, password: string) {
    return new Promise<any>((resolve, reject) => {

      ConnectyCube.createSession().then(() => {

        const userProfile = {
          login: login,
          password: password,
          full_name: userName,
        };

        ConnectyCube.users.signup(userProfile)
          .then(() => {
            this.login(login, password)
              .then((user: any) => {
                console.log("Logging user", user);
              })
              .catch((error: any) => {
                console.error('Logging Error!', error);
                reject();
              })
          })
          .catch((error: any) => {
            console.log("Sign up", error);
            reject();
          })

      });
    })
  }
}
