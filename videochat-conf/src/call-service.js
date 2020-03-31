import Handlebars from "handlebars";
import { users, janusConfig, NO_ASNWER_TIMER } from "./config";

const iOS = window.device?.platform === "iOS";

class CallService {

  _answerUserTimers = {}
  currentUserID
  participantIds = []
  initiatorID
  janusRoomId
  isGuestMode
  currentUserName

  init = () => {
    ConnectyCube.chat.onSystemMessageListener = this.onSystemMessage.bind(this);
    ConnectyCube.videochatconference.onParticipantJoinedListener = this.onAcceptCallListener.bind(this);
    ConnectyCube.videochatconference.onParticipantLeftListener = this.onStopCallListener.bind(this);
    ConnectyCube.videochatconference.onRemoteStreamListener = this.onRemoteStreamListener.bind(this);

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
  };

  _session = null;
  videoDevicesIds = [];

  addStreamElement = opponents => {
    const $videochatStreams = document.getElementById("videochat-streams");
    const $videochatStreamsTemplate = document.getElementById("videochat-streams-template");
    
    if (!Array.isArray(opponents)) {
      opponents = [opponents]
    }

    const curretActiveCallUsersCout = this._getActiveCallUsers().length
    const documentFragment = document.createDocumentFragment()

    opponents.forEach((opponent, index) => {
      const videochatStreamsTemplate = Handlebars.compile($videochatStreamsTemplate.innerHTML);

      document.getElementById("call").classList.add("hidden");
      document.getElementById("videochat").classList.remove("hidden");

      const streamBlock = document.createElement('div')
      streamBlock.innerHTML = videochatStreamsTemplate(opponent)
      streamBlock.classList.add("videochat-stream-container")
      streamBlock.dataset.id = `${opponent.id}`
      streamBlock.style.gridArea = `stream${index + curretActiveCallUsersCout}`
      documentFragment.appendChild(streamBlock)
    })

    $videochatStreams.classList.value = `grid-${opponents.length + curretActiveCallUsersCout}`

    $videochatStreams.appendChild(documentFragment)
  }

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
    const userName = this.isGuestMode ? userId : this._getUserById(userId, "name");
    const infoText = `${userName} has ${this.isGuestMode ? 'joined' : 'accepted'} the call`;
    this.showSnackbar(infoText);
    if (this.isGuestMode) {
      const userToAdd = {id: +userId, name: `${userId}`}
      this.addStreamElement(userToAdd)
      return 
    }
    this.$dialing.pause();
    this.clearNoAnswerTimers(userId)
  };

  _getActiveCallUsers() {
    const $streamsContainers = document.querySelectorAll(".videochat-stream-container");
    const stream = Array.from($streamsContainers)
    return stream.map(({dataset}) => ({id: +dataset.id, name: `${dataset.id}` }))
  }

  onRejectCallListener = (session, userId, extension = {}) => {
    const userName = this._getUserById(userId, "name");
    const infoText = extension.busy ? `${userName} is busy` : `${userName} rejected the call request`;

    this.stopCall(userId);
    this.showSnackbar(infoText);
  };

  onStopCallListener = (session, userId, extension) => {
    const isStoppedByInitiator = this.initiatorID === userId;
    const userName = this.initGuestRoom ? userId : this._getUserById(userId, "name");
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

    this._session.attachMediaStream(this.getStreamIdByUserId(userId), stream);
    this.removeStreamLoaderByUserId(userId)
    this.$muteUnmuteButton.disabled = false;
    this._prepareVideoElement(userId);
  };

  acceptCall = () => {
    const opponentsIds = [this.initiatorID, ...this.participantIds];
    const opponents = opponentsIds.map(id => ({ id, name: this._getUserById(id, "name") }));
    this.addStreamElement(opponents);
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
      this.janusRoomId = this._getUniqueRoomId()
      this.sendIncomingCallSystemMessage(opponentsIds, this.janusRoomId)
      document.getElementById("call").classList.add("hidden");
      document.getElementById("videochat").classList.remove("hidden");
      this.$dialing.play();
      this.addStreamElement(opponents);
      this.initiatorID = this.currentUserID
      this.startNoAnswerTimers(this.participantIds)
      this.joinConf(this.janusRoomId)
    } else {
      this.showSnackbar("Select at less one user to start Videocall");
    }
  };

  _getUniqueRoomId() {
    return ConnectyCube.chat.helpers.getBsonObjectId()
  }

  _getUniqueUserId() {
    const randomValue = `${Math.random()}`.replace('0.', '')
    return parseInt(randomValue.slice(0, 3) + randomValue.slice(-3), 10)
  }

  setSwitchDevice() {
    ConnectyCube.videochatconference.getMediaDevices(ConnectyCube.videochatconference.DEVICE_INPUT_TYPES.VIDEO)
      .then(devices => {
        this.videoDevicesIds = devices.map(({deviceId}) => deviceId)
        this.$switchCameraButton.disabled = this.videoDevicesIds.length < 2;
      })
  }

  joinConf = (janusRoomId, retry) => {
    this._session = ConnectyCube.videochatconference.createNewSession(janusConfig)
    return this._session.getUserMedia(this.mediaParams).then(stream => {
      this.addStreamElement({id: this.currentUserID, name: this.currentUserID, local: true})
      this.removeStreamLoaderByUserId(this.currentUserID)
      this._session.attachMediaStream(this.getStreamIdByUserId(this.currentUserID), stream, {muted: true, mirror: true});
      this._prepareVideoElement(this.currentUserID);
      return this._session.join(janusRoomId, this.currentUserID).then(() => this.postJoinActions())
    }, error => {
      console.warn('[Get user media error]', error)
      if (!retry) {
        this.mediaParams.video = false
        return this.joinConf(janusRoomId, true)
      }
    });
  }

  updateStreamGridOnRemove($streams, $videochatStreams) {
    $streams.forEach(($stream, index) => $stream.style.gridArea = `stream${index}`)
    $videochatStreams.classList.value = `grid-${$streams.length}`
  }

  stopCall = userId => {
    const $callScreen = document.getElementById("call");
    const $videochatScreen = document.getElementById("videochat");
    const $muteButton = document.getElementById("videochat-mute-unmute");
    const $videochatStreams = document.getElementById("videochat-streams");

    if (userId) {
      this.clearNoAnswerTimers(userId)
      this.participantIds = this.participantIds.filter(participant_id => participant_id != userId)
      this.removeStreamBlockByUserId(userId)

      const $streams = Array.from(document.querySelectorAll(".videochat-stream-container"));

      if ($streams.length < 2 && !this.isGuestMode) {
        this.stopCall();
      } else {
        this.updateStreamGridOnRemove($streams, $videochatStreams)
      }
    } else {
      if (!this.isGuestMode) {
        this.sendEndCallMessage([...this.participantIds, this.initiatorID], this.janusRoomId)
      }
      if (this._session) {
        this._session.leave();
      }
      ConnectyCube.videochatconference.clearSession(this._session.id);
      this.$dialing.pause();
      this.$calling.pause();
      this.$endCall.play();
      this.$muteUnmuteButton.disabled = true;
      this.$switchCameraButton.disabled = true;
      this._session = null;
      this.videoDevicesIds = [];
      this.clearNoAnswerTimers()
      this.initiatorID = void 0
      this.participantIds = []
      this.janusRoomId = void 0
      this.currentUserName = void 0
      if (this.isGuestMode) {
        window.location.href = window.location.origin
      }

      this.isGuestMode = void 0
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

  postJoinActions() {
    this.$muteUnmuteButton.disabled = false
    this.setSwitchDevice()
  }

  setAudioMute = () => {
    const $muteButton = document.getElementById("videochat-mute-unmute")

    if (this._session.isAudioMuted()) {
      this._session.unmuteAudio()
      $muteButton.classList.remove("muted")
    } else {
      this._session.muteAudio()
      $muteButton.classList.add("muted")
    }
  };

  switchCamera = () => {
    const mediaDevicesId = this.videoDevicesIds.find(deviceId => deviceId !== this._session.activeVideoDeviceId);
    this._session.switchMediaTracks({ video: mediaDevicesId }, this.getStreamIdByUserId(this.currentUserID))
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

  getStreamIdByUserId(userId) {
    return `stream-${userId}`
  }

  removeStreamLoaderByUserId(user_id) {
    const $loader = document.querySelector(`.videochat-stream-loader[data-id="${user_id}"]`)
    $loader.remove()
  }

  removeStreamBlockByUserId(user_id) {
    const $streamBblock = document.querySelector(`.videochat-stream-container[data-id="${user_id}"]`)
    $streamBblock.remove()
  }

  _prepareVideoElement = user_id => {
    const $video = document.getElementById(this.getStreamIdByUserId(user_id))

    $video.style.visibility = "visible";

    if (iOS) {
      document.getElementById("videochat").style.background = "transparent";
      $video.style.backgroundColor = "";
      $video.style.zIndex = -1;
    }
  };

  initGuestRoom = janusRoomId => {
    this.currentUserID = this._getUniqueUserId()
    while(!this.currentUserName) {
      this.currentUserName = prompt('Input user name', `User${this.currentUserID}`)
      if (this.currentUserName === null) {
        if (confirm('Do you shure to leave the call ?')) {
          window.location.href = window.location.origin
          return
        }
      }
    }
    this.isGuestMode = true
    if (janusRoomId) {
      this.janusRoomId = janusRoomId
    } else {
      this.janusRoomId = this._getUniqueRoomId()
      window.history.replaceState({}, 'Conference Guest Room', `/join/${this.janusRoomId}`)
    }
    this.joinConf(this.janusRoomId)
      .then(() => this.showSnackbar('Share the above url with the users you want to have a call with'))
  }

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
