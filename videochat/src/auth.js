import Alpine from "alpinejs";
import ConnectyCube from "connectycube";
import { credentials, appConfig } from "./config";

export default class Auth {
  constructor() {
    this.activeScreen = Alpine.store('screen');
    this.users = Alpine.store('users');
    this.ui = Alpine.store('ui');

    ConnectyCube.init(credentials, appConfig);
  }

  async login(user) {
    this.ui.isLoggingIn = true;

    await ConnectyCube.createSession(user);
    await ConnectyCube.chat.connect({
      userId: user.id,
      password: user.password,
    });

    this.ui.isLoggingIn = false;
    this.ui.screen = 'select';
    this.users.setCurrentUser(user);
  }

  async logout() {
    await ConnectyCube.destroySession();
    await ConnectyCube.chat.disconnect();

    this.users.current = null;
    this.ui.screen = 'login';
  }
};
