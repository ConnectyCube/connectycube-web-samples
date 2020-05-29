import Handlebars from "handlebars";
import AuthService from "./auth-service";
import CallService, { isWebRTCSupported, isiOS } from "./call-service";
import { users, GUEST_ROOM_ONLY_MODE, CALLING_ONLY_MODE } from "./config";

class UIService {
  init = () => {
    if (!isWebRTCSupported) {
      return alert(isiOS ? 'Due to iOS restrictions, only Safari browser supports voice and video calling. Please switch to Safari to get a complete functionality of TeaTalk app' : 'This browser does not support WebRTC')
    }

    const res = this.parseJoinRoomUrl()
    if (res) {
      console.log("[UIService][parseJoinRoomUrl] res", res)
      const [janusRoomId, janusServerEndpoint] = res;
      AuthService.init(janusServerEndpoint);
      this.createAndJoinGuestRoom(janusRoomId)
      return;
    } else {
      AuthService.init();
    }

    this.renderLoginUsers();
    document.querySelectorAll(".login-button[data-id]").forEach($element => $element.addEventListener("click", this.login));
    document.getElementById('guest-room-join-btn').addEventListener('click', () => this.createAndJoinGuestRoom())
  };

  addEventListenersForCallButtons = () => {
    document.getElementById("call-start").addEventListener("click", this.buttonOnClickListener(() => CallService.startCall()));
    document.getElementById("videochat-stop-call").addEventListener("click", this.buttonOnClickListener(() => CallService.stopCall()));
    document.getElementById("videochat-mute-unmute").addEventListener("click", this.buttonOnClickListener(() => CallService.setAudioMute()));
    document.getElementById("videochat-mute-unmute-video").addEventListener("click", this.buttonOnClickListener(() => CallService.setVideoMute()));
    document.getElementById("videochat-switch-camera").addEventListener("click", this.buttonOnClickListener(() => CallService.switchCamera()));
  };

  buttonOnClickListener = callback => {
    return event => {
      event.stopPropagation()
      callback()
    }
  }

  parseJoinRoomUrl = () => {
    const {pathname} = window.location
    const [,joinPath, roomInfo] = pathname.split('/')
    if (joinPath === 'join' && roomInfo) {
      return atob(roomInfo).split("##");
    }
    return null
  }

  createAndJoinGuestRoom = janusRoomId => {
    AuthService.createSession()
      .then(() => {
        CallService.init();
        AuthService.hideLoginScreen()
        CallService.initGuestRoom(janusRoomId)
        this.addEventListenersForCallButtons();
      })
  }

  login = ({ target }) => {
    const currentUserId = +target.dataset.id;
    const currentUser = users.find(({ id }) => currentUserId === id);

    AuthService.login(currentUser).then(() => {
      CallService.init();
      CallService.currentUserName = currentUser.name
      CallService.currentUserID = +currentUserId
      this.renderSelectUsers(currentUserId);
      this.addEventListenersForCallButtons();
    });
  };

  renderLoginUsers = () => {
    const $loginButtonsContainer = document.getElementById("login-buttons-container");
    const $loginButtonsTemplate = document.getElementById("login-buttons-template");
    const loginButtonsTemplate = Handlebars.compile($loginButtonsTemplate.innerHTML);

    $loginButtonsContainer.innerHTML = loginButtonsTemplate({ users, drawUsers: !GUEST_ROOM_ONLY_MODE,
                                                       drawJoinGuestRoomButton: !CALLING_ONLY_MODE || GUEST_ROOM_ONLY_MODE,
                                                               guestButtonText: GUEST_ROOM_ONLY_MODE ? 'Create and Join Guest Room' : 'Guest Room' });
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
