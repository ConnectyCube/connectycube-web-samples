import Handlebars from "handlebars";
import { users, janusConfig, NO_ASNWER_TIMER } from "./config";

const iOS = window.device?.platform === "iOS";

class CallService {

  _answerUserTimers = {}
  currentUserID
  participantIds = []
  initiatorID
  janusRoomId

  init = () => {
    ConnectyCube.chat.onSystemMessageListener = this.onSystemMessage.bind(this);
    ConnectyCube.videochatconference.onParticipantJoinedListener = this.onAcceptCallListener.bind(this);
    // ConnectyCube.videochat.onRejectCallListener = this.onRejectCallListener.bind(this);
    // ConnectyCube.videochat.onUserNotAnswerListener = this.onUserNotAnswerListener.bind(this);
    ConnectyCube.videochatconference.onParticipantLeftListener = this.onStopCallListener.bind(this);
    ConnectyCube.videochatconference.onRemoteStreamListener = this.onRemoteStreamListener.bind(this);
    // ConnectyCube.videochat.onDevicesChangeListener = this.onDevicesChangeListener.bind(this);

    document.getElementById("call-modal-reject").addEventListener("click", () => this.rejectCall());
    document.getElementById("call-modal-accept").addEventListener("click", () => this.acceptCall());
  };

  sendIncomingCallSystemMessage = (participantIds) => {
    const msg = {
      extension: {
        callStart: '1',
        janusRoomId: this.janusRoomId,
        participantIds: participantIds.join(','),
      }
    }
    return participantIds.map(user_id => ConnectyCube.chat.sendSystemMessage(user_id, msg))
  }

  sendRejectCallMessage = (participantIds, janusRoomId, isBusy) => {
    const msg = {
      extension: {
        callRejected: '1',
        janusRoomId,
        busy: !!isBusy
      }
    }
    return participantIds.map(user_id => ConnectyCube.chat.sendSystemMessage(user_id, msg))
  }

  sendEndCallMessage = (participantIds, janusRoomId) => {
    const msg = {
      extension: {
        callEnd: '1',
        janusRoomId
      }
    }
    return participantIds.map(user_id => ConnectyCube.chat.sendSystemMessage(user_id, msg))
  }

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
  };

  _session = null;
  mediaDevicesIds = [];
  activeDeviceId = null;
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

  onSystemMessage = msg => {
    const { extension, userId } = msg
    if (extension.callStart) {
      const {participantIds, janusRoomId} = extension
      const oponentIds = participantIds
        .split(',')
        .map(user_id => +user_id)
        .filter(user_id => user_id != this.currentUserID)
      if (this.janusRoomId) {
        return this.sendRejectCallMessage([...oponentIds, userId], janusRoomId, true)
      }
      this.janusRoomId = janusRoomId
      this.initiatorID = userId
      this.participantIds = oponentIds
      this.showIncomingCallModal();
    } else if (extension.callRejected) {
      const {janusRoomId} = extension
      if (this.janusRoomId === janusRoomId) {
        const {busy} = extension
        this.onRejectCallListener(this._session, userId, {busy})
      }
    } else if (extension.callEnd) {
      const {janusRoomId} = extension
      if (this.janusRoomId === janusRoomId) {
        this.onStopCallListener(this._session, userId)
      }
    }
  }

  onAcceptCallListener = (session, userId) => {
    const userName = this._getUserById(userId, "name");
    const infoText = `${userName} has accepted the call`;

    this.showSnackbar(infoText);
    this.$dialing.pause();
    this.clearNoAnswerTimers(userId)
  };

  onRejectCallListener = (session, userId, extension = {}) => {
    const userName = this._getUserById(userId, "name");
    const infoText = extension.busy ? `${userName} is busy` : `${userName} rejected the call request`;

    this.stopCall(userId);
    this.showSnackbar(infoText);
  };

  onStopCallListener = (session, userId, extension) => {
    console.warn(typeof this.initiatorID, typeof userId)
    const isStoppedByInitiator = this.initiatorID === userId;
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
    this.sendEndCallMessage([userId], this.janusRoomId)
    this.stopCall(userId)
  };

  onRemoteStreamListener = (session, userId, stream) => {
    if (!this._session) {
      return false;
    }

    const remoteStreamSelector = `remoteStream-${userId}`;

    document.getElementById(`videochat-stream-loader-${userId}`).remove();
    this._session.attachMediaStream(remoteStreamSelector, stream);

    this.$muteUnmuteButton.disabled = false;
    this._prepareVideoElement(remoteStreamSelector);
  };

  acceptCall = () => {
    const opponentsIds = [this.initiatorID, ...this.participantIds];
    const opponents = opponentsIds.map(id => ({ id, name: this._getUserById(id, "name") }));
    this.addStreamElements(opponents);
    this.hideIncomingCallModal();
    this.startNoAnswerTimers(this.participantIds)
    this.joinConf(this.janusRoomId)
  };

  rejectCall = (session, extension = {}) => {
    const participantIds = [this.initiatorID, ...this.participantIds]
    this.sendRejectCallMessage(participantIds, this.janusRoomId, false)
    this.hideIncomingCallModal();
    this.stopCall()
  };

  startCall = () => {
    const opponents = [];
    const opponentsIds = [];

    document.querySelectorAll(".select-user-checkbox").forEach($checkbox => {
      if ($checkbox.checked) {
        const id = +$checkbox.dataset.id;
        const name = this._getUserById(id, "name");

        opponents.push({ id, name });
        opponentsIds.push(id);
        $checkbox.checked = false;
      }
    });

    if (opponents.length > 0) {
      this.participantIds = opponentsIds
      this.janusRoomId = ConnectyCube.chat.helpers.getBsonObjectId()
      this.sendIncomingCallSystemMessage(opponentsIds, this.janusRoomId)

      ConnectyCube.videochatconference.getMediaDevices(ConnectyCube.videochatconference.DEVICE_INPUT_TYPES.VIDEO)
        .then(devices => {
          this.mediaDevicesIds = devices.map(({deviceId}) => deviceId)
          this.$switchCameraButton.disabled = this.mediaDevicesIds.length < 2;
        })
      
      document.getElementById("call").classList.add("hidden");
      document.getElementById("videochat").classList.remove("hidden");
      this.$dialing.play();
      this.addStreamElements(opponents);
      this.initiatorID = this.currentUserID
      this.startNoAnswerTimers(this.participantIds)
      this.joinConf(this.janusRoomId)
    } else {
      this.showSnackbar("Select at less one user to start Videocall");
    }
  };

  joinConf = janusRoomId => {
    this._session = ConnectyCube.videochatconference.createNewSession(janusConfig)
    this._session.getUserMedia(this.mediaParams).then(stream => {
      this.$muteUnmuteButton.disabled = false;
      this.setActiveDeviceId(stream);
      this._prepareVideoElement("localStream");
      return this._session.join(janusRoomId, this.currentUserID)
    });
  }

  stopCall = userId => {
    const $callScreen = document.getElementById("call");
    const $videochatScreen = document.getElementById("videochat");
    const $muteButton = document.getElementById("videochat-mute-unmute");
    const $videochatStreams = document.getElementById("videochat-streams");

    if (userId) {
      this.clearNoAnswerTimers(userId)
      this.participantIds = this.participantIds.filter(participant_id => participant_id != userId)
      document.getElementById(`videochat-stream-container-${userId}`).remove();

      const $streamContainers = document.querySelectorAll(".videochat-stream-container");

      if ($streamContainers.length < 2) {
        this.stopCall();
      } else if ($streamContainers.length === 2) {
        $videochatStreams.classList.value = "";
      } else if ($streamContainers.length === 3) {
        $videochatStreams.classList.value = "grid-2-1";
      }
    } else {
      this.sendEndCallMessage([...this.participantIds, this.initiatorID], this.janusRoomId)
      if (this._session) {
        this._session.leave({});
      }
      ConnectyCube.videochat.clearSession();
      this.$dialing.pause();
      this.$calling.pause();
      this.$endCall.play();
      this.$muteUnmuteButton.disabled = true;
      this.$switchCameraButton.disabled = true;
      this._session = null;
      this.mediaDevicesIds = [];
      this.clearNoAnswerTimers()
      this.activeDeviceId = null;
      this.isAudioMuted = false;
      this.initiatorID = void 0
      this.participantIds = []
      this.janusRoomId = void 0
      $videochatStreams.innerHTML = "";
      $videochatStreams.classList.value = "";
      $callScreen.classList.remove("hidden");
      $videochatScreen.classList.add("hidden");
      $muteButton.classList.remove("muted");
      if (iOS) {
        $videochatScreen.style.background = "#000000";
      }
    }
  };

  setActiveDeviceId = stream => {
    if (stream && !iOS) {
      const videoTracks = stream.getVideoTracks();
      const videoTrackSettings = videoTracks[0].getSettings();
      this.activeDeviceId = videoTrackSettings.deviceId;
    }
  };

  setAudioMute = () => {
    const $muteButton = document.getElementById("videochat-mute-unmute");

    if (this.isAudioMuted) {
      this._session.unmute(ConnectyCube.videochatconference.CALL_TYPES.AUDIO);
      this.isAudioMuted = false;
      $muteButton.classList.remove("muted");
    } else {
      this._session.mute(ConnectyCube.videochatconference.CALL_TYPES.AUDIO);
      this.isAudioMuted = true;
      $muteButton.classList.add("muted");
    }
  };

  switchCamera = () => {
    const mediaDevicesId = this.mediaDevicesIds.find(deviceId => deviceId !== this.activeDeviceId);
    console.log('[switchCamera]', this.activeDeviceId, this.mediaDevicesIds, mediaDevicesId)
    this._session.switchMediaTracks({ video: mediaDevicesId }).then(() => {
      this.activeDeviceId = mediaDevicesId;
      if (this.isAudioMuted) {
        this._session.mute("audio");
      }
    })
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
      $initiator.innerHTML = this._getUserById(this.initiatorID, "name");
      this.$modal.classList.add("show");
      this.$calling.play();
    }
  };

  _getUserById = (userId, key) => {
    const user = users.find(user => user.id == userId);

    return typeof key === "string" ? user[key] : user;
  };

  _prepareVideoElement = videoElement => {
    const $video = document.getElementById(videoElement);

    $video.style.visibility = "visible";

    if (iOS) {
      document.getElementById("videochat").style.background = "transparent";
      $video.style.backgroundColor = "";
      $video.style.zIndex = -1;
    }
  };

  startNoAnswerTimers(participantIds) {
    participantIds.forEach(user_id => {
      this._answerUserTimers[user_id] = setTimeout(() => this.onUserNotAnswerListener(this._session, user_id), NO_ASNWER_TIMER)
    })
  }

  clearNoAnswerTimers(user_id) {
    if (user_id) {
      clearTimeout(this._answerUserTimers[user_id])
      return delete this._answerUserTimers[user_id]
    }
    Object.values(this._answerUserTimers).forEach(timerId => clearTimeout(timerId))
    this._answerUserTimers = {}
  }
}

export default new CallService();
