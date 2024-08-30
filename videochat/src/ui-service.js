import Handlebars from "handlebars";
import AuthService from "./auth-service";
import CallService from "./call-service";
import { users } from "./config";

class UIService {
  init = () => {
    this.renderLoginUsers();
    AuthService.init();
    document.querySelectorAll(".login-button").forEach($element => $element.addEventListener("click", this.login));
  };

  addEventListenersForCallButtons = () => {
    document.getElementById("call-start-audio").addEventListener("click", () => CallService.startAudioCall());
    document.getElementById("call-start-video").addEventListener("click", () => CallService.startVideoCall());
    document.getElementById("videochat-stop-call").addEventListener("click", () => CallService.stopCall());
    document.getElementById("videochat-mute-unmute").addEventListener("click", () => CallService.setAudioMute());
    document.getElementById("videochat-switch-camera").addEventListener("click", () => CallService.switchCamera());
    document.getElementById("videochat-sharing-screen").addEventListener("click", () => CallService.sharingScreen());
  };

  login = ({ target }) => {
    const currentUserId = +target.dataset.id;
    const currentUser = users.find(({ id }) => currentUserId === id);

    AuthService.login(currentUser).then(() => {
      CallService.init(currentUser);
      this.renderSelectUsers(currentUserId);
      this.addEventListenersForCallButtons();
    });
  };

  renderLoginUsers = () => {
    const $loginButtonsContainer = document.getElementById("login-buttons-container");
    const $loginButtonsTemplate = document.getElementById("login-buttons-template");
    const loginButtonsTemplate = Handlebars.compile($loginButtonsTemplate.innerHTML);

    $loginButtonsContainer.innerHTML = loginButtonsTemplate({ users });
  };

  renderSelectUsers = currentUserId => {
    const $callSelectUsers = document.getElementById("call-select-users");
    const $selectUsersTemplate = document.getElementById("select-users-template");
    const selectUsersTemplate = Handlebars.compile($selectUsersTemplate.innerHTML);
    const usersForSelect = users.filter(({ id }) => currentUserId !== id);

    $callSelectUsers.innerHTML = selectUsersTemplate({ usersForSelect });
  };
}

// create instance
const UI = new UIService();
// lock instance
Object.freeze(UI);

export default UI;
