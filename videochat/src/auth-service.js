import ConnectyCube from "connectycube";
import { credentials, appConfig } from "./config";

class AuthService {
  $loginScreen = document.getElementById("login");
  $callScreen = document.getElementById("call");
  $loader = document.getElementById("login-loader");
  $caption = document.getElementById("login-caption");

  init = () => ConnectyCube.init(credentials, appConfig);

  login = async (user) => {
    this.$loader.classList.remove("hidden");
    this.$caption.classList.add("hidden");

    await ConnectyCube.createSession(user);
    await ConnectyCube.chat.connect({
      userId: user.id,
      password: user.password,
    });

    this.$loginScreen.classList.add("hidden");
    this.$callScreen.classList.remove("hidden");
    this.$loader.classList.add("hidden");
    this.$caption.classList.remove("hidden");
  };

  logout = () => {
    ConnectyCube.chat.disconnect();
    ConnectyCube.destroySession();

    this.$callScreen.classList.add("hidden");
    this.$loginScreen.classList.remove("hidden");
  };
}

// create instance
const Auth = new AuthService();
// lock instance
Object.freeze(Auth);

export default Auth;
