import Auth from "./Auth";
import Calls from "./Calls";

export default class App {
  constructor() {
    this.auth = new Auth();
    this.calls = new Calls();
  }

  init() {
    this.$watch("$store.ui.isIncomingCall", (isIncomingCall) => {
      if (isIncomingCall) {
        this.playDialingSound();
      }
    });

    this.$watch("$store.ui.isOutgoingCall", (isOutgoingCall) => {
      if (!isOutgoingCall) {
        this.stopCallingSound();
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
    if (this.$store.users.selected.length < 1) {
      return;
    }

    await this.calls.startAudioCall();
    this.playCallingSound();
  }

  async startVideoCall() {
    if (this.$store.users.selected.length < 1) {
      return;
    }

    await this.calls.startVideoCall();
    this.playCallingSound();
  }

  acceptCall() {
    this.stopDialingSound();
    this.calls.acceptCall();
  }

  rejectCall() {
    this.stopDialingSound();
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
    this.playEndCallSound();
  }

  switchCamera() {
    this.calls.switchCamera();
  }

  screenShare() {
    this.calls.screenShare();
  }

  playEndCallSound() {
    if (this.$refs.signalEnd) {
      this.$refs.signalEnd.currentTime = 0;
      this.$refs.signalEnd.play();
    }
  }

  playCallingSound() {
    if (this.$refs.signalOut) {
      this.$refs.signalOut.currentTime = 0;
      this.$refs.signalOut.play();
    }
  }

  playDialingSound() {
    if (this.$refs.signalIn) {
      this.$refs.signalIn.currentTime = 0;
      this.$refs.signalIn.play();
    }
  }

  stopCallingSound() {
    if (this.$refs.signalOut) {
      this.$refs.signalOut.currentTime = 0;
      this.$refs.signalOut.pause();
    }
  }


  stopDialingSound() {
    if (this.$refs.signalIn) {
      this.$refs.signalIn.currentTime = 0;
      this.$refs.signalIn.pause();
    }
  }
};