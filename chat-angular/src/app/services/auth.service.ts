import { Injectable } from '@angular/core';
import { appConfig } from './config';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { addMeParticipant } from '../reducers/participants/participants.actions';
import { logout } from '../reducers/app.action';
import { ChatService } from './chat.service';
import { chatConnected } from '../reducers/interface/interface.actions';
import ConnectyCube, { Config, Users } from 'connectycube';

type User = {
  login: string;
  password: string;
  full_name?: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private store$: Store,
    private chatService: ChatService
  ) {}

  public init(CREDENTIALS: Config.Credentials, appConfig: Config.Options) {
    const appConfigToken = {
      ...appConfig,
      on: {
        sessionExpired: (handleResponse: any, retry: any) => {
          this.cleanTokenAndNavigateToLoginScreen();
        },
      },
    };
    return ConnectyCube.init(CREDENTIALS, appConfigToken);
  }

  public async login(userProfile: User) {
    const session = await ConnectyCube.createSession(userProfile);

    const user = session?.user!;

    localStorage.setItem('token', btoa(session.token));
    localStorage.setItem('login', btoa(user.login!));

    this.store$.dispatch(
      addMeParticipant({
        me: true,
        login: user.login!,
        id: user.id,
        avatar: user.avatar,
        full_name: user.full_name!,
        unselect: true,
      })
    );

    await this.connectToChat(user.id, userProfile.password);

    this.chatInit();
  }

  public async register(userName: string, login: string, password: string) {
    const userProfile = {
      login: login,
      password: password,
      full_name: userName,
    };

    await ConnectyCube.users.signup(userProfile);

    return this.login(userProfile);
  }

  public async connectToChat(id: number, password: string) {
    const userCredentials = {
      userId: id,
      password: password,
    };

    return await ConnectyCube.chat.connect(userCredentials);
  }

  public async initSessionFromToken(token: string) {
    const credentials = {
      appId: Number(environment.APP_ID),
      token: token,
    };

    const login = atob(localStorage.getItem('login') || '');

    this.init(credentials, appConfig);

    const response: Users.GetV2Response = await ConnectyCube.users.getV2({
      login,
    });

    const user = response.items[0];
    this.store$.dispatch(
      addMeParticipant({
        me: true,
        login: user.login as string,
        id: user.id,
        avatar: user.avatar,
        full_name: user.full_name || '',
        unselect: true,
      })
    );
    await this.connectToChat(user.id, token);

    this.chatInit();
  }

  public async logout() {
    await ConnectyCube.chat.disconnect();
    await ConnectyCube.destroySession();

    this.store$.dispatch(logout());
    this.cleanTokenAndNavigateToLoginScreen();
  }

  public chatInit() {
    this.chatService.init();
    this.store$.dispatch(chatConnected());
  }

  public cleanTokenAndNavigateToLoginScreen() {
    this.router.navigateByUrl('/auth');
    localStorage.removeItem('token');
    localStorage.removeItem('login');
  }
}
