import {Injectable} from '@angular/core';
import {appConfig} from "./config";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {addMeParticipant} from "../reducers/participants/participants.actions";
import {logout} from "../reducers/app.action";
import {ChatService} from "./chat.service";
import {chatConnected} from "../reducers/interface/interface.actions";
import ConnectyCube from "connectycube";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private store$: Store, private chatService: ChatService) {
  }

  public cleanTokenAndNavigateToLoginScreen() {
    this.router.navigateByUrl("/auth");
    localStorage.removeItem('token');
    localStorage.removeItem('login');
  }

  public connectToChat(id: number, password: string) {
    const userCredentials = {
      userId: id,
      password: password,
    };

    return ConnectyCube.chat.connect(userCredentials);
  }

  public createSession() {
    return ConnectyCube.createSession();
  }

  public initSessionFromToken(token: string) {
    const credentials = {
      appId: Number(environment.APP_ID),
      token: token
    }
    const appConfigToken = {
      ...appConfig, on: {
        sessionExpired: (handleResponse: any, retry: any) => {
          this.cleanTokenAndNavigateToLoginScreen();
        },
      }
    };

    const login = atob(localStorage.getItem('login') || "");

    this.init(credentials, appConfigToken);
    ConnectyCube.users.get({login}).then((u: any) => {
      const user = u.user;
      this.store$.dispatch(addMeParticipant({
        me: true,
        login: user.login,
        id: user.id,
        avatar: user.avatar,
        full_name: user.full_name
      }))
      this.connectToChat(user.id, token).then(() => {
        this.chatInit();
      })
    })
  }

  public chatInit() {
    this.chatService.init();
    this.store$.dispatch(chatConnected());
  }

  public logout() {
    ConnectyCube.logout()
      .then(() => {
        ConnectyCube.chat.disconnect();
        this.store$.dispatch(logout());
        this.cleanTokenAndNavigateToLoginScreen();
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  public login(login: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      const userProfileLogin = {
        login: login,
        password: password
      }

      ConnectyCube.login(userProfileLogin).then((u: any) => {
        this.store$.dispatch(addMeParticipant({
          me: true,
          login: u.login,
          id: u.id,
          avatar: u.avatar,
          full_name: u.full_name
        }))
        localStorage.setItem('login', btoa(u.login));
        this.connectToChat(u.id, password).then(() => {
          this.chatInit();
        });
        resolve();
      })
        .catch((error: any) => {
          reject(error);
        });
    })
  }

  public init(CREDENTIALS: object, appConfig: object) {
    return ConnectyCube.init(CREDENTIALS, appConfig);
  }

  public register(userName: string, login: string, password: string) {
    return this.createSession().then((session: any) => {

      const userProfile = {
        login: login,
        password: password,
        full_name: userName,
      };

      localStorage.setItem('token', btoa(session.token));

      return ConnectyCube.users.signup(userProfile)
        .then(() => {
          return this.login(login, password);
        })
    });
  }
}
