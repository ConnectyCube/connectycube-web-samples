import {Injectable} from '@angular/core';
import {CommonUtilities} from "../utilities/common.utilities";

declare let ConnectyCube: any;

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

  public auth(userName: string) {
    return new Promise<number>((resolve, reject) => {

      ConnectyCube.createSession().then(() => {
        const login: string = CommonUtilities.randomLogin() + CommonUtilities.randomLogin();

        const userProfile = {
          login: login,
          password: CommonUtilities.hashCode(login),
          full_name: userName,
        };
        const userProfileLogin = {
          login: userProfile.login,
          password: userProfile.password
        }

        ConnectyCube.users.signup(userProfile)
          .then(() => {
            this.login(userProfileLogin)
              .then((user: any) => {
                console.log("logging user", user);
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
                this.login(userProfileLogin)
                  .then((user: any) => {
                    console.log("logging user", user);
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
