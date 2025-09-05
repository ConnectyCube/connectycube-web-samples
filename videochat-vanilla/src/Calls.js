import Alpine from "alpinejs";
import ConnectyCube from "connectycube";

const iOS = window.device?.platform === "iOS";
const isMobile =
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  ) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    (navigator.userAgent || navigator.vendor || window.opera).substr(0, 4)
  );

export default class Calls {
  isOnline = window.navigator.onLine;
  iceRestartTimeout = null;
  needIceRestartForUsersIds = [];

  constructor({ playSound, pauseSound }) {
    this.playSound = playSound;
    this.pauseSound = pauseSound;
    this.toast = Alpine.store('toast');
    this.users = Alpine.store('users');
    this.ui = Alpine.store('ui');
  }

  init = () => {
    console.log("[Calls][init]");

    ConnectyCube.videochat.addListener('call', this.onCallListener);
    ConnectyCube.videochat.addListener('accept', this.onAcceptCallListener);
    ConnectyCube.videochat.addListener('reject', this.onRejectCallListener);
    ConnectyCube.videochat.addListener('stop', this.onStopCallListener);
    ConnectyCube.videochat.addListener('not-answer', this.onUserNotAnswerListener);
    ConnectyCube.videochat.addListener('remote-stream', this.onRemoteStreamListener);
    ConnectyCube.videochat.addListener('devices', this.onDevicesChangeListener);
    ConnectyCube.videochat.addListener('connection-state', this.onSessionConnectionStateChangedListener);

    window.onoffline = () => {
      this.isOnline = false;
      console.log("OFFLINE");
    };

    window.ononline = () => {
      console.log("ONLINE");
      if (!this.isOnline) {
        if (this.callSession && this.needIceRestartForUsersIds.length > 0) {
          for (let userID of this.needIceRestartForUsersIds) {
            this.maybeDoIceRestart(this.callSession, userID);
          }
        }
      }
      this.isOnline = true;
    };
  };

  mediaParams = {
    audio: true,
    video: true,
    elementId: "localStream",
    options: {
      muted: true,
      mirror: true,
    },
  };

  screenShareMediaParams = {
    audio: true,
    video: { frameRate: { ideal: 10, max: 15 } },
    elementId: "localStream",
    options: {
      muted: true,
      mirror: false,
    },
  };

  callSession = null;
  videoDevicesIds = [];
  activeVideoDeviceId = null;
  isAudioMuted = false;
  startEventScreenShare = null;

  defaultSettings = () => {
    if (isMobile) {
      this.ui.isScreenShareDisabled = true;
    }
  };

  onCallListener = (session, _extension) => {
    const { initiatorID, currentUserID, opponentsIDs } = session;

    if (initiatorID === currentUserID) {
      return false;
    }

    if (this.callSession) {
      this.rejectCall(session, { busy: true });
      return false;
    }

    const myOpponentsIds = [...opponentsIDs, initiatorID].filter((id) => id !== currentUserID);

    this.users.initOpponents(myOpponentsIds);
    this.callSession = session;
    this.showIncomingCallModal();
  };

  onAcceptCallListener = (session, userId, _extension) => {
    if (userId === session.currentUserID) {
      if (this.ui.isIncomingCall) {
        this.callSession = null;
        this.hideIncomingCallModal();
        this.toast.show("You have accepted the call on other side");
      }

      return false;
    } else {
      this.pauseSound('signalOut');
      this.toast.show(`${this.users.getUser(userId, "name")} has accepted the call`);
    }
  };

  onRejectCallListener = (session, userId, extension = {}) => {
    if (userId === session.currentUserID) {
      if (this.ui.isIncomingCall) {
        this.callSession = null;
        this.hideIncomingCallModal();
        this.toast.show("You have rejected the call on other side");
      }

      return false;
    } else {
      const userName = this.users.getUser(userId, "name");
      const infoText = extension.busy
        ? `${userName} is busy`
        : `${userName} rejected the call request`;

      this.users.removeOpponent(userId);
      this.pauseSound('signalOut');
      this.toast.show(infoText);
      this.stopCall(userId);
    }
  };

  onStopCallListener = (session, userId, _extension) => {
    if (!this.callSession) {
      return false;
    }

    const isStoppedByInitiator = session.initiatorID === userId;
    const userName = this.users.getUser(userId, "name");
    const infoText = `${userName} has ${isStoppedByInitiator ? "stopped" : "left"} the call`;

    this.users.removeOpponent(userId);
    this.pauseSound('signalOut');
    this.toast.show(infoText);

    if (isStoppedByInitiator) {
      this.hideIncomingCallModal();
      this.stopCall();
    } else {
      this.stopCall(userId);
    }
  };

  onUserNotAnswerListener = (_session, userId) => {
    if (!this.callSession) {
      return false;
    }

    const userName = this.users.getUser(userId, "name");
    const infoText = `${userName} did not answer`;

    this.users.removeOpponent(userId);
    this.pauseSound('signalOut');
    this.toast.show(infoText);
    this.stopCall(userId);
  };

  onRemoteStreamListener = (_session, userId, stream) => {
    if (!this.callSession) {
      return false;
    }

    const remoteStreamSelector = `remoteStream-${userId}`;

    this.users.updateOpponent(userId, { stream });
    this.callSession.attachMediaStream(remoteStreamSelector, stream);

    this.onDevicesChangeListener();
    this._prepareVideoElement(remoteStreamSelector);
  };

  async acceptCall() {
    const extension = {};

    this.hideIncomingCallModal();
    this.defaultSettings();

    const mediaOptions = { ...this.mediaParams };

    if (this.isAudioType) {
      delete mediaOptions.video;
    }

    const stream = await this.callSession.getUserMedia(mediaOptions);

    if (
      !this.callSession.getDisplayMedia ||
      this.isAudioType
    ) {
      this.ui.isScreenShareDisabled = true;
    }

    this.callSession.accept(extension);
    this.setActiveDeviceId(stream);
    this._prepareVideoElement("localStream");
    this.ui.screen = "videochat";
  }

  rejectCall = (session, extension = {}) => {
    if (session) {
      session.reject(extension);
    } else {
      this.callSession.reject(extension);
      this.callSession = null;
      this.hideIncomingCallModal();
    }
  };

  async startAudioCall() {
    await this.startCall(ConnectyCube.videochat.CallType.AUDIO);
  };

  async startVideoCall() {
    await this.startCall(ConnectyCube.videochat.CallType.VIDEO);
  };

  async startCall(callType) {
    const options = {};

    this.users.initOpponents(this.users.selected.map(Number));

    this.defaultSettings();

    if (this.users.opponentsSize > 0) {
      this.ui.screen = "videochat";

      this.callSession = ConnectyCube.videochat.createNewSession(
        this.users.opponentsIds,
        callType,
        options
      );

      const mediaOptions = { ...this.mediaParams };

      if (this.isAudioType) {
        delete mediaOptions.video;
      }

      const stream = await this.callSession.getUserMedia(mediaOptions);

      if (
        !this.callSession.getDisplayMedia ||
        this.isAudioType
      ) {
        this.ui.isScreenShareDisabled = true;
      }

      this.callSession.call({});
      this.playSound('signalOut');
      this.setActiveDeviceId(stream);
      this._prepareVideoElement("localStream");
      this.onDevicesChangeListener();

      // send push notification when calling

      const currentUserId = this.callSession.currentUserID;
      const currentUserName = this.users.getUser(currentUserId, "name");
      const params = {
        message: `Incoming call from ${currentUserName}`,
        ios_voip: 1,
        initiatorId: currentUserId,
        opponentsIds: this.users.opponentsIdsString,
        handle: currentUserName,
        uuid: this.callSession.ID,
        callType: this.isVideoType ? "video" : "audio",
      };

      // uncomment if you use Web <-> Flutter
      // const params = {
      //   message: `Incoming call from ${currentUserName}`,
      //   ios_voip: 1,
      //   caller_id: this.callSession.initiatorID,
      //   call_opponents: this.users.opponentsIdsString,
      //   caller_name: currentUserName,
      //   session_id: this.callSession.ID,
      //   call_type: callType,
      //   signal_type: 'startCall'
      // };
      const payload = JSON.stringify(params);
      const pushParameters = {
        notification_type: "push",
        user: { ids: this.users.opponentsIds },
        message: ConnectyCube.pushnotifications.base64Encode(payload),
      };

      ConnectyCube.pushnotifications.events
        .create(pushParameters)
        .then((_result) => {
          console.log("[sendPushNotification] Ok");
        })
        .catch((error) => {
          console.warn("[sendPushNotification] Error", error);
        });
    } else {
      this.toast.show("Select at less one user to start the video call");
    }
  };

  stopCall = (userId) => {
    if (userId) {
      if (this.users.opponentsSize < 1) {
        this.stopCall();
      }
    } else if (this.callSession) {
      this.callSession.stop({});
      this.pauseSound('signalOut');
      this.playSound('signalEnd');
      ConnectyCube.videochat.clearSession(this.callSession.ID);
      this.callSession = null;
      this.videoDevicesIds = [];
      this.activeVideoDeviceId = null;
      this.isAudioMuted = false;

      if (this.ui.isScreenShare) {
        this.ui.isScreenShare = false;
      }

      if (iOS) {
        document.getElementById("videochat").style.background = "#000000";
      }

      this.ui.screen = "select";
      this.users.selected = [];
      this.users.clearOpponents();
    }
  };

  onDevicesChangeListener = () => {
    if (iOS) return;

    ConnectyCube.videochat
      .getMediaDevices("videoinput")
      .then((videoDevices) => {
        this.videoDevicesIds = videoDevices?.map(({ deviceId }) => deviceId);
        console.warn(this.videoDevicesIds);
        if (this.videoDevicesIds.length < 2 || this.isAudioType) {
          this.ui.isSwitchCameraDisabled = true;

          if (
            this.activeVideoDeviceId &&
            this.videoDevicesIds?.[0] !== this.activeVideoDeviceId &&
            !this.ui.isScreenShare
          ) {
            this.switchCamera();
          }
        } else {
          this.ui.isSwitchCameraDisabled = false;
        }
      });
  };

  onSessionConnectionStateChangedListener = (
    session,
    userID,
    connectionState
  ) => {
    console.log(
      "[onSessionConnectionStateChangedListener]",
      userID,
      connectionState
    );

    const { DISCONNECTED, FAILED, CONNECTED, CLOSED } = ConnectyCube.videochat.SessionConnectionState;

    if (connectionState === DISCONNECTED || connectionState === FAILED) {
      this.iceRestartTimeout = setTimeout(() => {
        console.log(
          "Connection not restored within 30 seconds, trying ICE restart.."
        );
        if (this.isOnline) {
          this.maybeDoIceRestart(session, userID);
        } else {
          console.log("Skip ICE restart, no Internet connection ");
          this.needIceRestartForUsersIds.push(userID);
        }
      }, 30000);
    } else if (connectionState === CONNECTED) {
      clearTimeout(this.iceRestartTimeout);
      this.iceRestartTimeout = null;
      this.needIceRestartForUsersIds = [];
    } else if (connectionState === CLOSED) {
      this.needIceRestartForUsersIds = [];
    }
  };

  async maybeDoIceRestart(session, userID) {
    console.log("[maybeDoIceRestart] Chat PING");

    try {
      await ConnectyCube.chat.pingWithTimeout();

      console.log("[maybeDoIceRestart] Chat PONG");
      console.log(
        "[maybeDoIceRestart] canInitiateIceRestart: ",
        session.canInitiateIceRestart(userID)
      );

      if (session.canInitiateIceRestart(userID)) {
        console.log("[maybeDoIceRestart] do ICE restart");
        session.iceRestart(userID);
      }
    } catch (error) {
      console.error(error.message);
      console.log("[maybeDoIceRestart] do Chat restart");

      await ConnectyCube.chat.disconnect();
      await ConnectyCube.chat.connect({
        userId: this.currentUser.id,
        password: this.currentUser.password,
      });

      console.log("[maybeDoIceRestart] Chat restarted");
      console.log(
        "[maybeDoIceRestart] canInitiateIceRestart: ",
        session.canInitiateIceRestart(userID)
      );

      if (session.canInitiateIceRestart(userID)) {
        console.log("[maybeDoIceRestart] do ICE restart");
        session.iceRestart(userID);
      }
    }
  }

  setActiveDeviceId = (stream) => {
    if (stream && !iOS) {
      const videoTracks = stream.getVideoTracks();
      const videoTrackSettings = videoTracks[0]?.getSettings();

      this.activeVideoDeviceId = videoTrackSettings?.deviceId;
    }
  };

  toggleAudioMute = () => {
    if (this.isAudioMuted) {
      this.callSession.unmute("audio");
      this.isAudioMuted = false;
      this.ui.isAudioMuted = false;
    } else {
      this.callSession.mute("audio");
      this.isAudioMuted = true;
      this.ui.isAudioMuted = true;
    }
  };

  toggleVideoMute = () => {
    if (this.isVideoMuted) {
      this.callSession.unmute("video");
      this.isVideoMuted = false;
      this.ui.isVideoMuted = false;
    } else {
      this.callSession.mute("video");
      this.isVideoMuted = true;
      this.ui.isVideoMuted = true;
    }
  };

  switchCamera = () => {
    const videoDevicesId = this.videoDevicesIds.find(
      (deviceId) => deviceId !== this.activeVideoDeviceId
    );

    this.callSession.switchMediaTracks({ video: videoDevicesId }).then(() => {
      this.activeVideoDeviceId = videoDevicesId;

      if (this.isAudioMuted) {
        this.callSession.mute("audio");
      }
    });
  };

  screenShare = () => {
    if (!this.ui.isScreenShare) {
      return this.callSession
        .getDisplayMedia(this.screenShareMediaParams, true)
        .then(
          (stream) => {
            this.updateStream(stream);
            this.ui.isScreenShare = true;
            this.startEventScreenShare = stream
              .getVideoTracks()[0]
              .addEventListener("ended", () => this.stopScreenShare());
          },
          (error) => {
            console.warn("[Get display media error]", error, this.mediaParam);
            this.stopScreenShare();
          }
        );
    } else {
      this.stopScreenShare();
    }
  };

  stopScreenShare = () => {
    return this.callSession.getUserMedia(this.mediaParams, true).then((stream) => {
      this.updateStream(stream);
      this.ui.isScreenShare = false;
      this.startEventScreenShare = null;
    });
  };

  updateStream = (stream) => {
    this.setActiveDeviceId(stream);
    this._prepareVideoElement("localStream");
  };

  _prepareVideoElement = (videoElement) => {
    const $video = document.getElementById(videoElement);

    $video.style.visibility = "visible";

    if (iOS) {
      document.getElementById("videochat").style.background = "transparent";
      $video.style.backgroundColor = "";
      $video.style.zIndex = -1;
    }
  };

  showIncomingCallModal = () => {
    const userId = this.callSession.initiatorID;

    this.ui.isIncomingCall = true;
    this.ui.incomingCallText = `Incoming ${this.isVideoType ? "video " : this.isAudioType ? "audio " : ""}call from `;
    this.ui.incomingCallUserName = this.users.getUser(userId, 'name');
    this.playSound('signalIn');
  };

  hideIncomingCallModal = () => {
    this.ui.isIncomingCall = false;
    this.ui.incomingCallText = "";
    this.ui.incomingCallUserName = "";
    this.pauseSound('signalIn');
  };

  get isVideoType() {
    return this.callSession.callType === ConnectyCube.videochat.CallType.VIDEO;
  }

  get isAudioType() {
    return this.callSession.callType === ConnectyCube.videochat.CallType.AUDIO;
  }
}
