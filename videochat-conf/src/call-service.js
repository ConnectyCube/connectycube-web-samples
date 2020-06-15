import Handlebars from "handlebars";
import { users, NO_ASNWER_TIMER, messages, appConfig, defaultAvatarlist } from "./config";

export const isiOS = window.device?.platform === "iOS" || !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);;
export const isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test((navigator.userAgent || navigator.vendor || window.opera)) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent || navigator.vendor || window.opera).substr(0, 4))
export const isWebRTCSupported = window.RTCPeerConnection !== undefined && window.RTCPeerConnection !== null && navigator.getUserMedia !== undefined && navigator.getUserMedia !== null

class CallService {
  static USER_NAME_KEY = "ConnectyCubeVideoConf:UserNameKey";

  _answerUserTimers = {}
  currentUserID
  participantIds = []
  initiatorID
  janusRoomId
  isGuestMode
  currentUserName
  avatarIndex = {}

  init = () => {
    ConnectyCube.chat.onSystemMessageListener = this.onSystemMessage.bind(this);
    ConnectyCube.videochatconference.onParticipantJoinedListener = this.onAcceptCallListener.bind(this);
    ConnectyCube.videochatconference.onParticipantLeftListener = this.onStopCallListener.bind(this);
    ConnectyCube.videochatconference.onRemoteStreamListener = this.onRemoteStreamListener.bind(this);
    ConnectyCube.videochatconference.onSlowLinkListener = this.onSlowLinkListener.bind(this);
    ConnectyCube.videochatconference.onRemoteConnectionStateChangedListener = this.onRemoteConnectionStateChangedListener.bind(this);
    ConnectyCube.videochatconference.onSessionConnectionStateChangedListener = this.onSessionConnectionStateChangedListener.bind(this);

    document.getElementById("call-modal-reject").addEventListener("click", () => this.rejectCall());
    document.getElementById("call-modal-accept").addEventListener("click", () => this.acceptCall());
    document.body.classList.add('black-bg')
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

  $muteUnmuteAudioButton = document.getElementById("videochat-mute-unmute");
  $muteUnmuteVideoButton = document.getElementById("videochat-mute-unmute-video");
  $switchCameraButton = document.getElementById("videochat-switch-camera");

  mediaParams = {
    video: { width: 1280, height: 720 },
    audio: true
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

  setDefaultAvatar = (user_id) => {
    const $avatar = document.querySelector(`.user-placeholder[data-id="${user_id}"] .user-image`);
    if (!this.avatarIndex[user_id]) {
      this.avatarIndex[user_id] = Math.floor(Math.random() * 10)
    }
    $avatar.style.background = `#ffffff url("../images/animals/${defaultAvatarlist[this.avatarIndex[user_id]]}") no-repeat center`
    $avatar.style.backgroundSize = 'contain'
  }

  toggleUserPlaceholder(user_id, toShow) {
    const $userPlaceHolder = document.querySelector(`.user-placeholder[data-id="${user_id}"]`)
    this.setDefaultAvatar(user_id);
    if (toShow) {
      $userPlaceHolder.classList.add('show')
    } else {
      $userPlaceHolder.classList.remove('show')
    }
  }

  onSystemMessage = msg => {
    console.warn('[onSystemMessage]', msg)
    const { extension, userId } = msg
    if (extension.callStart) {
      const { participantIds, janusRoomId } = extension
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
      const { janusRoomId } = extension
      if (this.janusRoomId === janusRoomId) {
        const { busy } = extension
        this.onRejectCallListener(this._session, userId, { busy })
      }
    } else if (extension.callEnd) {
      const { janusRoomId } = extension
      if (this.janusRoomId === janusRoomId) {
        this.onStopCallListener(this._session, userId)
      }
    }
  }

  onAcceptCallListener = (session, userId, displayName) => {
    console.warn('[onAcceptCallListener]', userId, displayName)
    const userName = this.isGuestMode ? displayName : this._getUserById(userId, "name");
    const infoText = `${userName} has ${this.isGuestMode ? 'joined' : 'accepted'} the call`;
    this.showSnackbar(infoText);
    if (this.isGuestMode) {
      const userToAdd = { id: +userId, name: `${displayName || userId}` }
      this.addStreamElement(userToAdd)
      return
    }
    this.$dialing.pause();
    this.clearNoAnswerTimers(userId)
  };

  _getActiveCallUsers() {
    const $streamsContainers = document.querySelectorAll(".videochat-stream-container");
    const stream = Array.from($streamsContainers)
    return stream.map(({ dataset }) => ({ id: +dataset.id, name: `${dataset.id}` }))
  }

  onRejectCallListener = (session, userId, extension = {}) => {
    const userName = this._getUserById(userId, "name");
    const infoText = extension.busy ? `${userName} is busy` : `${userName} rejected the call request`;

    this.stopCall(userId);
    this.showSnackbar(infoText);
  };

  onStopCallListener = (session, userId) => {
    console.warn('[onStopCallListener]', userId)
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
    console.warn('[onUserNotAnswerListener]', userId)
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
    console.warn('[onRemoteStreamListener]', userId)
    if (!this._session) {
      return false;
    }

    this._session.attachMediaStream(this.getStreamIdByUserId(userId), stream);
    this.removeStreamLoaderByUserId(userId)
    const isStremaWithVideo = stream.getVideoTracks().length > 0
    this._prepareVideoElement(userId, isStremaWithVideo);
  };

  onSlowLinkListener = (session, userId, uplink, nacks) => {
    console.warn('[onSlowLinkListener]', userId, uplink, nacks)
  }

  onRemoteConnectionStateChangedListener = (session, userId, iceState) => {
    console.warn('[onRemoteConnectionStateChangedListener]', userId, iceState)
  }

  onSessionConnectionStateChangedListener = (session, iceState) => {
    console.warn('[onSessionConnectionStateChangedListener]', iceState)
  }

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
      this.showSnackbar(messages.select_more_users);
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
        this.videoDevicesIds = devices.map(({ deviceId }) => deviceId)
        this.$switchCameraButton.disabled = this.videoDevicesIds.length < 2;
      })
  }

  toggelStreamMirror(user_id) {
    const $stream = document.getElementById(this.getStreamIdByUserId(user_id))
    $stream.classList.toggle('mirror')
  }

  joinConf = (janusRoomId, retry) => {
    this._session = ConnectyCube.videochatconference.createNewSession()
    return this._session.getUserMedia(this.mediaParams).then(stream => {
      this.addStreamElement({ id: this.currentUserID, name: 'Me', local: true })
      this.removeStreamLoaderByUserId(this.currentUserID)
      this._session.attachMediaStream(this.getStreamIdByUserId(this.currentUserID), stream, { muted: true });
      this._prepareVideoElement(this.currentUserID, this.mediaParams.video);
      this.toggelStreamMirror(this.currentUserID)
      return this._session.join(janusRoomId, this.currentUserID, this.currentUserName).then(() => this.postJoinActions())
    }, error => {
      console.warn('[Get user media error]', error, this.mediaParam)
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
      this.$muteUnmuteAudioButton.disabled = true;
      this.$muteUnmuteVideoButton.disabled = true
      this.$switchCameraButton.disabled = true;
      this._session = null;
      this.videoDevicesIds = [];
      this.clearNoAnswerTimers()
      this.initiatorID = void 0
      this.participantIds = []
      this.janusRoomId = void 0
      this.currentUserName = void 0
      // this.mediaParams = {video: true, audio: true}
      this.mediaParams = { video: { width: 1280, height: 720 }, audio: true }
      if (this.isGuestMode) {
        window.location.href = window.location.origin
      }
      this.isGuestMode = void 0
      $videochatStreams.innerHTML = "";
      $videochatStreams.classList.value = "";
      $callScreen.classList.remove("hidden");
      $videochatScreen.classList.add("hidden");
      $muteButton.classList.remove("muted");
      if (isiOS) {
        $videochatScreen.style.background = "#000000";
      }
    }
  };

  postJoinActions() {
    this.$muteUnmuteAudioButton.disabled = false
    if (this.mediaParams.video) {
      this.$muteUnmuteVideoButton.disabled = false
      this.setSwitchDevice()
    }
    this.addBodyOnClickListener()
  }

  addBodyOnClickListener = () => {
    document.body.onclick = this.onClickBody
  }

  onClickBody = () => {
    const callToolButtons = document.getElementById('videochat-buttons-container')
    callToolButtons.classList.toggle('hidden')
  }

  setAudioMute = () => {
    const $muteAudioButton = document.getElementById("videochat-mute-unmute")

    if (this._session.isAudioMuted()) {
      this._session.unmuteAudio()
      $muteAudioButton.classList.remove("muted")
    } else {
      this._session.muteAudio()
      $muteAudioButton.classList.add("muted")
    }
  };

  setVideoMute = () => {
    const $muteVideoButton = document.getElementById("videochat-mute-unmute-video")

    if (this._session.isVideoMuted()) {
      this._session.unmuteVideo()
      $muteVideoButton.classList.remove("muted")
      this.toggleUserPlaceholder(this.currentUserID, false)
    } else {
      this._session.muteVideo()
      $muteVideoButton.classList.add("muted")
      this.toggleUserPlaceholder(this.currentUserID, true)
    }
  };

  switchCamera = () => {
    this.$switchCameraButton.disabled = true;
    const mediaDevicesId = this.videoDevicesIds.find(deviceId => deviceId !== this._session.activeVideoDeviceId);
    this._session.switchMediaTracks({ video: mediaDevicesId })
      .then(newLocalStream => {
        this.toggelStreamMirror(this.currentUserID)
        if (isMobile) {
          this._session.attachMediaStream(this.getStreamIdByUserId(this.currentUserID), newLocalStream, { muted: true });
        }
      })
      .finally(() => setTimeout(() => this.$switchCameraButton.disabled = false, 700))
  };

  /* SNACKBAR */

  showSnackbar = infoText => {
    const $snackbar = document.getElementById("snackbar");

    $snackbar.innerHTML = infoText;
    $snackbar.classList.add("show");

    setTimeout(function () {
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
    if (!$loader) {
      return
    }
    $loader.remove()
  }

  removeStreamBlockByUserId(user_id) {
    const $streamBblock = document.querySelector(`.videochat-stream-container[data-id="${user_id}"]`)
    $streamBblock.remove()
  }

  _prepareVideoElement = (user_id, isStremaWithVideo) => {
    if (!isStremaWithVideo) {
      return this.toggleUserPlaceholder(user_id, true)
    }
    const $video = document.getElementById(this.getStreamIdByUserId(user_id))

    $video.style.visibility = "visible";

    if (isiOS) {
      document.body.style.background = "transparent";
      document.getElementById("videochat").style.background = "transparent";
      $video.style.backgroundColor = "";
      $video.style.zIndex = -1;
    }
  };

  initGuestRoom = janusRoomId => {
    this.currentUserID = this._getUniqueUserId()
    const parseName = JSON.parse(localStorage.getItem(CallService.USER_NAME_KEY))
    const userName = parseName ? parseName : this.getRandomName();

    while (!this.currentUserName) {
      this.currentUserName = prompt(messages.prompt_user_name, userName)
      localStorage.setItem(CallService.USER_NAME_KEY, JSON.stringify(this.currentUserName))
      if (this.currentUserName === null) {
        if (confirm(messages.confirm_cancel)) {
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
      const roomInfo = btoa(`${this.janusRoomId}##${appConfig.conference.server}`)
      window.history.replaceState({}, 'Conference Guest Room', `/join/${roomInfo}`)
    }
    this.joinConf(this.janusRoomId)
      .then(() => this.showSnackbar(messages.share_call_link))
  }

  getRandomName = () => {
    const dogNames = require('dog-names');
    return dogNames.allRandom();
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
