import Auth from "./auth";
import Calls from "./calls";

export default class App {
  constructor() {
    this.playSound = (sound) => {
      const $audioRef = this.$refs[sound];

      if ($audioRef) {
        $audioRef.currentTime = 0;
        $audioRef.play().catch(() => { });
      }
    };

    this.pauseSound = (sound) => {
      const $audioRef = this.$refs[sound];

      if ($audioRef) {
        $audioRef.currentTime = 0;
        $audioRef.pause();
      }
    };

    this.auth = new Auth();
    this.calls = new Calls({ playSound: this.playSound, pauseSound: this.pauseSound });
  }

  init() {
    this.$watch("$store.ui.isIncomingCall", (isIncomingCall) => {
      if (isIncomingCall) {
        this.playSound('signalIn');
      } else {
        this.pauseSound('signalIn');
      }
    });
  }

  async login(user) {
    this.calls.init(user);
    await this.auth.login(user);
  }

  async logout() {
    await this.auth.logout();
  }


  async startAudioCall() {
    await this.calls.startAudioCall();
  }

  async startVideoCall() {
    await this.calls.startVideoCall();
  }

  acceptCall() {
    this.calls.acceptCall();
  }

  rejectCall() {
    this.calls.rejectCall();
  }

  toggleAudioMute() {
    this.calls.toggleAudioMute();
  }

  toggleVideoMute() {
    this.calls.toggleVideoMute();
  }

  stopCall() {
    this.calls.stopCall();
  }

  switchCamera() {
    this.calls.switchCamera();
  }

  screenShare() {
    this.calls.screenShare();
  }
};
