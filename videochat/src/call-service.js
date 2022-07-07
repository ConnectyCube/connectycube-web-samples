// import ConnectyCube from "connectycube";
import Handlebars from "handlebars";
import { users } from "./config";

const iOS = window.device?.platform === "iOS";
const isMobile =
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  ) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    (navigator.userAgent || navigator.vendor || window.opera).substr(0, 4)
  );

class CallService {
  init = () => {
    console.log("[CallService][init]");

    ConnectyCube.videochat.onCallListener = this.onCallListener.bind(this);
    ConnectyCube.videochat.onAcceptCallListener =
      this.onAcceptCallListener.bind(this);
    ConnectyCube.videochat.onRejectCallListener =
      this.onRejectCallListener.bind(this);
    ConnectyCube.videochat.onStopCallListener =
      this.onStopCallListener.bind(this);
    ConnectyCube.videochat.onUserNotAnswerListener =
      this.onUserNotAnswerListener.bind(this);
    ConnectyCube.videochat.onRemoteStreamListener =
      this.onRemoteStreamListener.bind(this);
    ConnectyCube.videochat.onDevicesChangeListener =
      this.onDevicesChangeListener.bind(this);
    ConnectyCube.videochat.onSessionConnectionStateChangedListener =
      this.onSessionConnectionStateChangedListener.bind(this);

    document
      .getElementById("call-modal-reject")
      .addEventListener("click", () => this.rejectCall());
    document
      .getElementById("call-modal-accept")
      .addEventListener("click", () => this.acceptCall());
  };

  $calling = document.getElementById("signal-in");
  $dialing = document.getElementById("signal-out");
  $endCall = document.getElementById("signal-end");

  $modal = document.getElementById("call-modal-icoming");

  $muteUnmuteButton = document.getElementById("videochat-mute-unmute");
  $switchCameraButton = document.getElementById("videochat-switch-camera");
  $switchSharingScreenButton = document.getElementById(
    "videochat-sharing-screen"
  );

  mediaParams = {
    audio: true,
    video: true,
    elementId: "localStream",
    options: {
      muted: true,
      mirror: true,
    },
  };

  sharingScreenMediaParams = {
    audio: true,
    video: { frameRate: { ideal: 10, max: 15 } },
    elementId: "localStream",
    options: {
      muted: true,
      mirror: true,
    },
  };

  _session = null;
  mediaDevicesIds = [];
  activeDeviceId = null;
  isAudioMuted = false;
  isSharingScreen = false;
  startEventSharinScreen = null;

  defaultSettings = () => {
    if (isMobile) {
      this.$switchSharingScreenButton.disabled = true;
    }
  };

  addStreamElements = (opponents) => {
    const $videochatStreams = document.getElementById("videochat-streams");
    const $videochatStreamsTemplate = document.getElementById(
      "videochat-streams-template"
    );
    const videochatStreamsTemplate = Handlebars.compile(
      $videochatStreamsTemplate.innerHTML
    );

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
      const infoText = extension.busy
        ? `${userName} is busy`
        : `${userName} rejected the call request`;

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
    const infoText = `${userName} has ${
      isStoppedByInitiator ? "stopped" : "left"
    } the call`;

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

    const remoteStreamSelector = `remoteStream-${userId}`;

    document.getElementById(`videochat-stream-loader-${userId}`).remove();
    this._session.attachMediaStream(remoteStreamSelector, stream);

    this.$muteUnmuteButton.disabled = false;
    this.onDevicesChangeListener();
    this._prepareVideoElement(remoteStreamSelector);
  };

  acceptCall = () => {
    const extension = {};
    const { opponentsIDs, initiatorID, currentUserID } = this._session;
    const opponentsIds = [initiatorID, ...opponentsIDs].filter(
      (userId) => currentUserID !== userId
    );
    const opponents = opponentsIds.map((id) => ({
      id,
      name: this._getUserById(id, "name"),
    }));
    this.defaultSettings();
    this.addStreamElements(opponents);
    this.hideIncomingCallModal();
    this._session.getUserMedia(this.mediaParams).then((stream) => {
      if (!this._session.getDisplayMedia) {
        this.$switchSharingScreenButton.disabled = true;
      }

      this._session.accept(extension);
      this.setActiveDeviceId(stream);
      this._prepareVideoElement("localStream");
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
    this.defaultSettings();

    document.querySelectorAll(".select-user-checkbox").forEach(($checkbox) => {
      if ($checkbox.checked) {
        const id = +$checkbox.dataset.id;
        const name = this._getUserById(id, "name");

        opponents.push({ id, name });
        opponentsIds.push(id);
        $checkbox.checked = false;
      }
    });

    if (opponents.length > 0) {
      document.getElementById("call").classList.add("hidden");
      document.getElementById("videochat").classList.remove("hidden");
      this.$dialing.play();
      this.addStreamElements(opponents);
      this._session = ConnectyCube.videochat.createNewSession(
        opponentsIds,
        type,
        options
      );
      this._session.getUserMedia(this.mediaParams).then((stream) => {
        if (!this._session.getDisplayMedia) {
          this.$switchSharingScreenButton.disabled = true;
        }

        this._session.call({});
        this.setActiveDeviceId(stream);
        this._prepareVideoElement("localStream");
      });

      // send push notification when calling

      const currentUserName = this._getUserById(this._session.initiatorID, "name");
      const params = {
        message: `Incoming call from ${currentUserName}`,
        ios_voip: 1,
        callerName: currentUserName,
        handle: currentUserName,
        uuid: this.uuidv4(),
        callType: "video"
      };
      const payload = JSON.stringify(params);
      const pushParameters = {
        notification_type: "push",
        user: { ids: opponentsIds },
        message: ConnectyCube.pushnotifications.base64Encode(payload),
      };

      ConnectyCube.pushnotifications.events.create(pushParameters)
        .then(result => {
          console.log("[sendPushNotification] Ok");
        }).catch(error => {
          console.warn("[sendPushNotification] Error", error);
        });

    } else {
      this.showSnackbar("Select at less one user to start Videocall");
    }
  };

  stopCall = (userId) => {
    const $callScreen = document.getElementById("call");
    const $videochatScreen = document.getElementById("videochat");
    const $muteButton = document.getElementById("videochat-mute-unmute");
    const $videochatStreams = document.getElementById("videochat-streams");

    if (userId) {
      document.getElementById(`videochat-stream-container-${userId}`).remove();

      const $streamContainers = document.querySelectorAll(
        ".videochat-stream-container"
      );

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

      if (this.isSharingScreen) {
        this.isSharingScreen = false;
        this.updateSharingScreenBtn();
      }

      if (iOS) {
        $videochatScreen.style.background = "#000000";
      }
    }
  };

  onDevicesChangeListener = () => {
    if (iOS) return;

    ConnectyCube.videochat
      .getMediaDevices("videoinput")
      .then((mediaDevices) => {
        this.mediaDevicesIds = mediaDevices?.map(({ deviceId }) => deviceId);

        if (this.mediaDevicesIds.length < 2) {
          this.$switchCameraButton.disabled = true;

          if (
            this.mediaDevicesIds?.[0] !== this.activeDeviceId &&
            !this.isSharingScreen
          ) {
            this.switchCamera();
          }
        } else {
          this.$switchCameraButton.disabled = false;
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
  };

  setActiveDeviceId = (stream) => {
    if (stream && !iOS) {
      const videoTracks = stream.getVideoTracks();
      const videoTrackSettings = videoTracks[0].getSettings();

      this.activeDeviceId = videoTrackSettings.deviceId;
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
    const mediaDevicesId = this.mediaDevicesIds.find(
      (deviceId) => deviceId !== this.activeDeviceId
    );

    this._session.switchMediaTracks({ video: mediaDevicesId }).then(() => {
      this.activeDeviceId = mediaDevicesId;

      if (this.isAudioMuted) {
        this._session.mute("audio");
      }
    });
  };

  sharingScreen = () => {
    if (!this.isSharingScreen) {
      return this._session
        .getDisplayMedia(this.sharingScreenMediaParams, true)
        .then(
          (stream) => {
            this.updateStream(stream);
            this.isSharingScreen = true;
            this.updateSharingScreenBtn();
            this.startEventSharinScreen = stream
              .getVideoTracks()[0]
              .addEventListener("ended", () => this.stopSharingScreen());
          },
          (error) => {
            console.warn("[Get display media error]", error, this.mediaParam);
            this.stopSharingScreen();
          }
        );
    } else {
      this.stopSharingScreen();
    }
  };

  updateSharingScreenBtn = () => {
    const $videochatSharingScreen = document.getElementById(
      "videochat-sharing-screen"
    );
    const $videochatSharingScreenIcon = document.getElementById(
      "videochat-sharing-screen-icon"
    );

    if (this.isSharingScreen) {
      $videochatSharingScreen.classList.add("videochat-sharing-screen-active");
      $videochatSharingScreenIcon.classList.add(
        "videochat-sharing-screen-icon-active"
      );
    } else {
      $videochatSharingScreen.classList.remove(
        "videochat-sharing-screen-active"
      );
      $videochatSharingScreenIcon.classList.remove(
        "videochat-sharing-screen-icon-active"
      );
    }
  };

  stopSharingScreen = () => {
    return this._session.getUserMedia(this.mediaParams, true).then((stream) => {
      this.updateStream(stream);
      this.isSharingScreen = false;
      this.updateSharingScreenBtn();
      this.startEventSharinScreen = null;
    });
  };

  updateStream = (stream) => {
    this.setActiveDeviceId(stream);
    this._prepareVideoElement("localStream");
  };

  /* SNACKBAR */

  showSnackbar = (infoText) => {
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

  _incomingCallModal = (className) => {
    const $initiator = document.getElementById("call-modal-initiator");

    if (className === "hide") {
      $initiator.innerHTML = "";
      this.$modal.classList.remove("show");
      this.$calling.pause();
    } else {
      $initiator.innerHTML = this._getUserById(
        this._session.initiatorID,
        "name"
      );
      this.$modal.classList.add("show");
      this.$calling.play();
    }
  };

  _getUserById = (userId, key) => {
    const user = users.find((user) => user.id == userId);

    return typeof key === "string" ? user[key] : user;
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

  uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

export default new CallService();
