import {EventEmitter, Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "../reducers";

declare let ConnectyCube: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private store$: Store<State>) {
  }

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

  private static login(userProfileLogin: object) {
    return ConnectyCube.login(userProfileLogin);
  }

  public init(CREDENTIALS: object, appConfig: object) {
    ConnectyCube.init(CREDENTIALS, appConfig);
  }

  public auth(userName: string, JoinBtnClick?: EventEmitter<boolean>) {
    return new Promise<number>((resolve, reject) => {

      ConnectyCube.createSession().then(() => {
        const login: string = AuthService.randomLogin() + AuthService.randomLogin();

        const userProfile = {
          login: login,
          password: AuthService.hashCode(login),
          full_name: userName,
        };
        const userProfileLogin = {
          login: userProfile.login,
          password: userProfile.password
        }

        ConnectyCube.users.signup(userProfile)
          .then(() => {
            AuthService.login(userProfileLogin)
              .then((user: any) => {
                console.log("logging user", user);
                if (JoinBtnClick) {
                  JoinBtnClick.emit(true);
                }
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
                AuthService.login(userProfileLogin)
                  .then((user: any) => {
                    console.log("logging user", user);
                    if (JoinBtnClick) {
                      JoinBtnClick.emit(true);
                    }
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

      });
    })
  }
}
