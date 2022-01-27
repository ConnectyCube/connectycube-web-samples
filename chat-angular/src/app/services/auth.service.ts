import {Injectable} from '@angular/core';
import {appConfig} from "./config";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {addMeParticipant, updateParticipantLastActivity} from "../reducers/participants/participants.actions";
import {logout} from "../reducers/app.action";
import {ChatService} from "./chat.service";
import {getParticipantId} from "../reducers/dialog/dialog.selectors";
import {take} from 'rxjs/operators';
import {meSelector} from "../reducers/participants/participants.selectors";

declare let ConnectyCube: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private store$: Store, private chatService: ChatService) {
  }

  public tokenExpired() {
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
          this.tokenExpired();
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
    this.store$.select(meSelector).pipe(take(1)).subscribe(userMe => {
      if (userMe) {
        this.store$.select(getParticipantId, {meId: userMe.id}).pipe(take(1))
          .subscribe(participantId => {
            if (participantId) {
              this.chatService.getLastActivity(participantId)
                .then((result: any) => {
                  const seconds = result.seconds;
                  this.store$.dispatch(updateParticipantLastActivity({
                    participantId: participantId,
                    lastActivity: seconds
                  }));
                  console.warn(result)
                })
                .catch((error: any) => {
                  console.error(error);
                });
            }
          })
      }
    })
  }

  public logout() {
    ConnectyCube.logout()
      .then(() => {
        ConnectyCube.chat.disconnect();
        this.store$.dispatch(logout());
        this.router.navigateByUrl("/auth");
        localStorage.removeItem('token');
        localStorage.removeItem('login');
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
