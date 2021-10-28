import {EventEmitter} from "@angular/core";

declare let ConnectyCube: any;

class UserAuthorization {

  private static randomLogin(): string {
    let text = "";
    let possible = "abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < 5; i++) {
      text += possible[Math.floor(Math.random() * possible.length)];
    }

    return text;
  }

  private static hashCode(s: string) {
    return String(s.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a
    }, 0));
  }

  public init(CREDENTIALS: object) {
    ConnectyCube.init(CREDENTIALS);
    ConnectyCube.createSession();
  }

  public auth(userName: string, JoinBtnClick: EventEmitter<boolean>) {
    return new Promise<number>((resolve, reject) => {

      const login: string = UserAuthorization.randomLogin();

      const userProfile = {
        login: login,
        password: UserAuthorization.hashCode(login),
        full_name: userName,
      };

      ConnectyCube.users.signup(userProfile)
        .then(() => {
          ConnectyCube.login({login: userProfile.login, password: userProfile.password})
            .then((user: any) => {
              console.log("logging user", user);
              JoinBtnClick.emit(true);
              resolve(user.id)
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
              ConnectyCube.login({login: userProfile.login, password: userProfile.password})
                .then((user: any) => {
                  console.log("logging user", user);
                  JoinBtnClick.emit(true);
                  resolve(user.id)
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

    })
  }

}

export const userAuthorization = Object.freeze(new UserAuthorization());
