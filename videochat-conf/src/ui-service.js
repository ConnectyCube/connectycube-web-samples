import AuthService from "./auth-service";
import CallService, { isWebRTCSupported, isiOS } from "./call-service";
import { messages } from "./config";

class UIService {
  init = () => {
    if (!isWebRTCSupported) {
      return alert(
        isiOS
          ? "Due to iOS restrictions, only Safari browser supports voice and video calling. Please switch to Safari to get a complete functionality of TeaTalk app"
          : "This browser does not support WebRTC"
      );
    }

    const res = this.parseJoinRoomUrl();
    if (res) {
      console.log("[UIService][parseJoinRoomUrl] res", res);
      const [janusRoomId, janusServerEndpoint] = res;
      AuthService.init(janusServerEndpoint);
      this.createAndJoinGuestRoom(janusRoomId);
      return;
    } else {
      AuthService.init();
    }

    document
      .getElementById("guest-room-join-btn")
      .addEventListener("click", () => this.createAndJoinGuestRoom());
  };

  addEventListenersForCallButtons = () => {
    document.getElementById("call-start").addEventListener(
      "click",
      this.buttonOnClickListener(() => CallService.startCall())
    );
    document.getElementById("videochat-stop-call").addEventListener(
      "click",
      this.buttonOnClickListener(() => CallService.stopCall())
    );
    document.getElementById("videochat-mute-unmute").addEventListener(
      "click",
      this.buttonOnClickListener(() => CallService.setAudioMute())
    );
    document.getElementById("videochat-mute-unmute-video").addEventListener(
      "click",
      this.buttonOnClickListener(() => CallService.setVideoMute())
    );
    document.getElementById("videochat-switch-camera").addEventListener(
      "click",
      this.buttonOnClickListener(() => { })
    );
    document.getElementById("videochat-sharing-screen").addEventListener(
      "click",
      this.buttonOnClickListener(() => CallService.sharingScreen())
    );
  };

  buttonOnClickListener = (callback) => {
    return (event) => {
      event.stopPropagation();
      callback();
    };
  };

  parseJoinRoomUrl = () => {
    const { pathname } = window.location;
    const [, joinPath, roomInfo] = pathname.split("/");
    if (joinPath === "join" && roomInfo) {
      return atob(roomInfo).split("##");
    }
    return null;
  };

  createAndJoinGuestRoom = async (janusRoomId) => {
    const userName = this.getRandomName();
    prompt(messages.prompt_user_name, userName);

    // login
    const user = await AuthService.login(userName);

    // hide login screen
    const loginScreen = document.getElementById("login");
    loginScreen.classList.add("hidden");

    CallService.init();
    CallService.initGuestRoom(janusRoomId, userName, user.id);

    this.addEventListenersForCallButtons();
  };

  getRandomName = () => {
    const dogNames = require("dog-names");
    return dogNames.randomDogName();
  };
}

// create instance
const UI = new UIService();
// lock instance
Object.freeze(UI);

export default UI;
