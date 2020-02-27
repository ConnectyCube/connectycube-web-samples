import ConnectyCube from "connectycube";
import Handlebars from "handlebars";
import { users } from "./config";

class CallService {
  init = () => {
    ConnectyCube.videochat.onCallListener = this.onCallListener.bind(this);
    ConnectyCube.videochat.onAcceptCallListener = this.onAcceptCallListener.bind(this);
    ConnectyCube.videochat.onRejectCallListener = this.onRejectCallListener.bind(this);
    ConnectyCube.videochat.onStopCallListener = this.onStopCallListener.bind(this);
    ConnectyCube.videochat.onUserNotAnswerListener = this.onUserNotAnswerListener.bind(this);
    ConnectyCube.videochat.onRemoteStreamListener = this.onRemoteStreamListener.bind(this);
    ConnectyCube.videochat.onDevicesChangeListener = this.onDevicesChangeListener.bind(this);

    document.getElementById("call-modal-reject").addEventListener("click", () => this.rejectCall());
    document.getElementById("call-modal-accept").addEventListener("click", () => this.acceptCall());
  };

  $calling = document.getElementById("signal-in");
  $dialing = document.getElementById("signal-out");
  $endCall = document.getElementById("signal-end");

  $modal = document.getElementById("call-modal-icoming");

  $muteUnmuteButton = document.getElementById("videochat-mute-unmute");
  $switchCameraButton = document.getElementById("videochat-switch-camera");

  mediaParams = {
    audio: true,
    video: true,
    elementId: "localStream",
    options: {
      muted: true,
      mirror: true
    }
  };

  _session = null;
  mediaDevicesIds = [];
  activeDeviceId = [];
  isAudioMuted = false;

  addStreamElements = opponents => {
    const $videochatStreams = document.getElementById("videochat-streams");
    const $videochatStreamsTemplate = document.getElementById("videochat-streams-template");
    const videochatStreamsTemplate = Handlebars.compile($videochatStreamsTemplate.innerHTML);

    if (opponents.length === 2) {
      $videochatStreams.classList.value = "grid-2-1";
    } else if (opponents.length === 3) {
      $videochatStreams.classList.value = "grid-2-2";
    }

    document.getElementById("call").classList.add("hidden");
    document.getElementById("videochat").classList.remove("hidden");
    $videochatStreams.innerHTML = videochatStreamsTemplate({ opponents });
  };

  onCallListener = (session, extension) => {
    if (session.initiatorID === session.currentUserID) {
      return false;
    }

    if (this._session) {
      this.rejectCall(session, { busy: true });
      return false;
    }

    this._session = session;
    this.showIncomingCallModal();
  };

  onAcceptCallListener = (session, userId, extension) => {
    if (userId === session.currentUserID) {
      if (this.$modal.classList.contains("show")) {
        this._session = null;
        this.hideIncomingCallModal();
        this.showSnackbar("You have accepted the call on other side");
      }

      return false;
    } else {
      const userName = this._getUserById(userId, "name");
      const infoText = `${userName} has accepted the call`;

      this.showSnackbar(infoText);
      this.$dialing.pause();
    }
  };

  onRejectCallListener = (session, userId, extension = {}) => {
    if (userId === session.currentUserID) {
      if (this.$modal.classList.contains("show")) {
        this._session = null;
        this.hideIncomingCallModal();
        this.showSnackbar("You have rejected the call on other side");
      }

      return false;
    } else {
      const userName = this._getUserById(userId, "name");
      const infoText = extension.busy ? `${userName} is busy` : `${userName} rejected the call request`;

      this.stopCall(userId);
      this.showSnackbar(infoText);
    }
  };

  onStopCallListener = (session, userId, extension) => {
    if (!this._session) {
      return false;
    }

    const isStoppedByInitiator = session.initiatorID === userId;
    const userName = this._getUserById(userId, "name");
    const infoText = `${userName} has ${isStoppedByInitiator ? "stopped" : "left"} the call`;

    this.showSnackbar(infoText);

    if (isStoppedByInitiator) {
      if (this.$modal.classList.contains("show")) {
        this.hideIncomingCallModal();
      }
      this.stopCall();
    } else {
      this.stopCall(userId);
    }
  };

  onUserNotAnswerListener = (session, userId) => {
    if (!this._session) {
      return false;
    }

    const userName = this._getUserById(userId, "name");
    const infoText = `${userName} did not answer`;

    this.showSnackbar(infoText);
    this.stopCall(userId);
  };

  onRemoteStreamListener = (session, userId, stream) => {
    if (!this._session) {
      return false;
    }

    document.getElementById(`videochat-stream-loader-${userId}`).remove();
    this._session.attachMediaStream(`remoteStream-${userId}`, stream);

    this.$muteUnmuteButton.disabled = false;
    this.onDevicesChangeListener();
  };

  acceptCall = () => {
    const extension = {};
    const { opponentsIDs, initiatorID, currentUserID } = this._session;
    const opponentsIds = [initiatorID, ...opponentsIDs].filter(userId => currentUserID !== userId);
    const opponents = opponentsIds.map(id => ({ id, name: this._getUserById(id, "name") }));

    this.addStreamElements(opponents);
    this.hideIncomingCallModal();
    this._session.getUserMedia(this.mediaParams).then(stream => {
      this._session.accept(extension);
      this.setActiveDeviceId(stream);
    });
  };

  rejectCall = (session, extension = {}) => {
    if (session) {
      session.reject(extension);
    } else {
      this._session.reject(extension);
      this._session = null;
      this.hideIncomingCallModal();
    }
  };

  startCall = () => {
    const options = {};
    const opponents = [];
    const opponentsIds = [];
    const type = ConnectyCube.videochat.CallType.VIDEO; // AUDIO is also possible

    this.$dialing.play();
    document.getElementById("call").classList.add("hidden");
    document.getElementById("videochat").classList.remove("hidden");
    document.querySelectorAll(".select-user-checkbox").forEach($checkbox => {
      if ($checkbox.checked) {
        const id = +$checkbox.dataset.id;
        const name = this._getUserById(id, "name");

        opponents.push({ id, name });
        opponentsIds.push(id);
        $checkbox.checked = false;
      }
    });

    this.addStreamElements(opponents);
    this._session = ConnectyCube.videochat.createNewSession(opponentsIds, type, options);
    this._session.getUserMedia(this.mediaParams).then(stream => {
      this._session.call({});
      this.setActiveDeviceId(stream);
    });
  };

  stopCall = userId => {
    const $callScreen = document.getElementById("call");
    const $videochatScreen = document.getElementById("videochat");
    const $muteButton = document.getElementById("videochat-mute-unmute");
    const $videochatStreams = document.getElementById("videochat-streams");

    if (userId) {
      document.getElementById(`videochat-stream-container-${userId}`).remove();

      const $streamContainers = document.querySelectorAll(".videochat-stream-container");

      if ($streamContainers.length < 2) {
        this.stopCall();
      } else if ($streamContainers.length === 2) {
        $videochatStreams.classList.value = "";
      } else if ($streamContainers.length === 3) {
        $videochatStreams.classList.value = "grid-2-1";
      }
    } else if (this._session) {
      this._session.stop({});
      ConnectyCube.videochat.clearSession(this._session.ID);
      this.$dialing.pause();
      this.$calling.pause();
      this.$endCall.play();
      this.$muteUnmuteButton.disabled = true;
      this.$switchCameraButton.disabled = true;
      this._session = null;
      this.mediaDevicesIds = [];
      this.activeDeviceId = null;
      this.isAudioMuted = false;
      $videochatStreams.innerHTML = "";
      $videochatStreams.classList.value = "";
      $callScreen.classList.remove("hidden");
      $videochatScreen.classList.add("hidden");
      $muteButton.classList.remove("muted");
    }
  };

  onDevicesChangeListener = () => {
    ConnectyCube.videochat.getMediaDevices("videoinput").then(mediaDevices => {
      this.mediaDevicesIds = mediaDevices?.map(({ deviceId }) => deviceId);
      this.$switchCameraButton.disabled = this.mediaDevicesIds.length < 2;
    });
  };

  setActiveDeviceId = stream => {
    if (stream) {
      const mediaStreamTrack = stream.getVideoTracks()[0];
      const mediaTrackSettings = mediaStreamTrack.getSettings();

      this.activeDeviceId = mediaTrackSettings.deviceId;
    }
  };

  setAudioMute = () => {
    const $muteButton = document.getElementById("videochat-mute-unmute");

    if (this.isAudioMuted) {
      this._session.unmute("audio");
      this.isAudioMuted = false;
      $muteButton.classList.remove("muted");
    } else {
      this._session.mute("audio");
      this.isAudioMuted = true;
      $muteButton.classList.add("muted");
    }
  };

  switchCamera = () => {
    const mediaDevicesId = this.mediaDevicesIds.find(deviceId => deviceId !== this.activeDeviceId);

    this._session.switchMediaTracks({ video: mediaDevicesId }).then(() => {
      this.activeDeviceId = mediaDevicesId;

      if (this.isAudioMuted) {
        this._session.mute("audio");
      }
    });
  };

  /* SNACKBAR */

  showSnackbar = infoText => {
    const $snackbar = document.getElementById("snackbar");

    $snackbar.innerHTML = infoText;
    $snackbar.classList.add("show");

    setTimeout(function() {
      $snackbar.innerHTML = "";
      $snackbar.classList.remove("show");
    }, 3000);
  };

  /*INCOMING CALL MODAL */

  showIncomingCallModal = () => this._incomingCallModal("show");

  hideIncomingCallModal = () => this._incomingCallModal("hide");

  _incomingCallModal = className => {
    const $initiator = document.getElementById("call-modal-initiator");

    if (className === "hide") {
      $initiator.innerHTML = "";
      this.$modal.classList.remove("show");
      this.$calling.pause();
    } else {
      $initiator.innerHTML = this._getUserById(this._session.initiatorID, "name");
      this.$modal.classList.add("show");
      this.$calling.play();
    }
  };

  _getUserById = (userId, key) => {
    const user = users.find(user => user.id == userId);

    return typeof key === "string" ? user[key] : user;
  };
}

export default new CallService();
