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
    document.getElementById("videochat-switch-camera").addEventListener("click", this.buttonOnClickListener(() => {}));
    document.getElementById("videochat-sharing-screen").addEventListener("click", this.buttonOnClickListener(() => CallService.sharingScreen()));
  };

  buttonOnClickListener = callback => {
    return event => {
      event.stopPropagation()
      callback()
    }
  }

  parseJoinRoomUrl = () => {
    const { pathname } = window.location
    const [, joinPath, roomInfo] = pathname.split('/')
    if (joinPath === 'join' && roomInfo) {
      return atob(roomInfo).split("##");
    }
    return null
  }

  createAndJoinGuestRoom = janusRoomId => {
    this.showLoginModal(janusRoomId)
  }

  showLoginModal = (janusRoomId=null) => {
    document.getElementById("modal").classList.remove("modal-unvisible");
    document.getElementById("modal").classList.add("modal");
    const cancel = document.getElementById('hide-modal')
    const signUp = document.getElementById('sign-up')
    cancel.addEventListener('click', this.hideModal, true);
    signUp.addEventListener('click', () => this.authUser(janusRoomId), true)
  }

  authUser = (janusRoomId) => {
    const login = document.getElementById('login_user').value;
    const password = document.getElementById('password_user').value;
    const isSignUp = document.getElementById('is_sign_up').checked;

    if(!login && !password){
      return alert('Пустая строка');
    }

    this.hideOrShowLoader(true)

    const userProfile = {
      login,
      password,
      full_name: login,
    };

    AuthService.initCCuser(userProfile, isSignUp)
      .then(() => {
        CallService.init();
        AuthService.hideLoginScreen()
        CallService.initGuestRoom(janusRoomId)
        this.addEventListenersForCallButtons();
        this.hideModal()
        this.hideOrShowLoader(false)
      })
      .catch(()=> {
        alert('error {AuthService.initCCuser}');
        this.hideOrShowLoader(false)
      }) 
  }

  hideOrShowLoader = (show) => {
    if(show){
      document.getElementById("loader").classList.remove("wrap-loader-unvisible");
      document.getElementById("loader").classList.add("wrap-loader");
    } else {
      document.getElementById("loader").classList.remove("wrap-loader");
      document.getElementById("loader").classList.add("wrap-loader-unvisible");
    }
  }

  hideModal = () => {
    document.getElementById("modal").classList.remove("modal");
    document.getElementById("modal").classList.add("modal-unvisible");
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

    $loginButtonsContainer.innerHTML = loginButtonsTemplate({
      users, drawUsers: !GUEST_ROOM_ONLY_MODE,
      drawJoinGuestRoomButton: !CALLING_ONLY_MODE || GUEST_ROOM_ONLY_MODE,
      guestButtonText: GUEST_ROOM_ONLY_MODE ? 'Create and Join Guest Room' : 'Guest Room'
    });
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
