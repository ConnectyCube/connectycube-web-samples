import Handlebars from "handlebars";
import AuthService from "./auth-service";
import CallService from "./call-service";
import { users } from "./config";

class UIService {
  init = () => {
    AuthService.init();
    if (this.checkJoinRoomUrl()) {
      return
    }
    this.renderLoginUsers();
    document.querySelectorAll(".login-button[data-id]").forEach($element => $element.addEventListener("click", this.login));
    document.getElementById('guest-room-join-btn').addEventListener('click', () => this.createAndJoinGuestRoom())
  };

  addEventListenersForCallButtons = () => {
    document.getElementById("call-start").addEventListener("click", () => CallService.startCall());
    document.getElementById("videochat-stop-call").addEventListener("click", () => CallService.stopCall());
    document.getElementById("videochat-mute-unmute").addEventListener("click", () => CallService.setAudioMute());
    document.getElementById("videochat-switch-camera").addEventListener("click", () => CallService.switchCamera());
  };

  checkJoinRoomUrl = () => {
    const {pathname} = window.location
    const [,joinPath, janusRoomId] = pathname.split('/')
    if (joinPath === 'join' && janusRoomId) {
      this.createAndJoinGuestRoom(janusRoomId)
      return true
    }
    return false
  }

  createAndJoinGuestRoom = janusRoomId => {
    CallService.init();
    AuthService.hideLoginScreen()
    const janusRoomUserName = 'Pimp'
    CallService.initGuestRoom(janusRoomUserName, janusRoomId)
    this.addEventListenersForCallButtons();
  }

  login = ({ target }) => {
    const currentUserId = +target.dataset.id;
    const currentUser = users.find(({ id }) => currentUserId === id);

    AuthService.login(currentUser).then(() => {
      CallService.init();
      CallService.currentUserID = +currentUserId
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
