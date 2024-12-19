import { Injectable } from '@angular/core';
import { CommonUtilities } from '../utilities/common.utilities';
import ConnectyCube from 'connectycube';
import { Config } from 'connectycube/dist/types/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  public init(CREDENTIALS: Config.Credentials, appConfig: Config.Options) {
    return ConnectyCube.init(CREDENTIALS, appConfig);
  }

  private async connectToChat(userCredentials: any) {
    await ConnectyCube.chat.connect(userCredentials);
    console.log('Connected to Chat');
  }

  public async auth(userName: string) {
    const login =
      localStorage.getItem('login') ||
      CommonUtilities.randomLogin() + CommonUtilities.randomLogin();

    const password = CommonUtilities.hashCode(login);

    const userParams = {
      login,
      password,
      full_name: userName || localStorage.getItem('userName'),
    };

    const session = await ConnectyCube.createSession(userParams);

    if (userName !== session?.user?.full_name) {
      ConnectyCube.users.update({ full_name: userName });
    }

    await this.connectToChat({
      userId: session?.user?.id,
      password: password,
    });

    localStorage.setItem('login', login);
    localStorage.setItem('userName', userName);

    return { id: session?.user?.id, name: userName };
  }
}
