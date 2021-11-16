import { isiOS, isMobile, detectBrowser } from "./heplers";
import ConnectyCube from "connectycube";
import { createContext, useEffect, useRef } from "react";
import { useState } from "react";
const CallContext = createContext();
export default CallContext;

export const CallProvider = ({ children }) => {
  const meetingIsRecording = useRef(true);
  const [view, setView] = useState("grid");
  const [preJoinScreen] = useState(false);
  const [choosedCam, setChoosedCam] = useState();
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [devicesStatus, setDevicesStatus] = useState({
    video: true,
    audio: true,
  });
  const withVideo = useRef(true);

  const [participants, setParticipants] = useState([
    {
      userId: null,
      name: "me",
      stream: null,
      bitrate: null,
      micLevel: null,
      connectionStatus: "good",
    },
  ]);

  console.log("participants", participants);

  const participantRef = useRef([
    {
      userId: null,
      name: "me",
      stream: null,
      bitrate: null,
      micLevel: null,
      connectionStatus: "good",
    },
  ]);

  const slowLinkTimersRef = useRef({});

  const MAX_MIC_LEVEL = 20000;
  const meetingId = useRef(null);
  const chatId = useRef(null);
  const [devices, setDevices] = useState({ video: false, audio: false });
  const [cams, setCams] = useState();
  let mediaParams = {
    video: { width: 1280, height: 720 },
    audio: true,
  };

  useEffect(() => {
    setInterval(() => {
      participantRef.current.forEach((p) => {
        if (p.name !== "me") {
          try {
            let bitrate = _session.current.getRemoteUserBitrate(p.userId);
            let micLevel =
              (_session.current.getRemoteUserVolume(p.userId) / MAX_MIC_LEVEL) *
              100;
            if (detectBrowser() === "Safari") {
              p.bitrate = bitrate / 1000;
            } else {
              p.bitrate = bitrate;
            }
            p.micLevel = micLevel.toFixed(2) + "%";
          } catch {}
        } else {
          p.bitrate = null;
        }
      });

      setParticipants([...participantRef.current]);
    }, 15000);
  }, []);

  const _session = useRef(null);

  const mediaDevices = (allDevices) => {
    let video = false;
    let audio = false;
    if (allDevices.find((e) => e.kind === "videoinput")) {
      video = true;
    }
    if (allDevices.find((e) => e.kind === "audioinput")) {
      audio = true;
    }

    return {
      audio,
      video,
      options: {
        muted: true,
        mirror: true,
      },
    };
  };

  const createCallbacks = () => {
    ConnectyCube.videochatconference.onParticipantJoinedListener = (
      session,
      userId,
      userDisplayName,
      isExistingParticipant
    ) => {
      console.log("OnJoin", { userId, userDisplayName, isExistingParticipant });
      participantRef.current.push({
        userId,
        name: userDisplayName,
        stream: null,
        connectionStatus: "good",
      });
      const newParticipants = [...participantRef.current];
      setParticipants(newParticipants);
    };
    ConnectyCube.videochatconference.onParticipantLeftListener = (
      session,
      userId
    ) => {
      participantRef.current = participantRef.current.filter(
        (e) => e.userId !== userId
      );
      const newParticipants = [...participantRef.current];
      setParticipants(newParticipants);
    };
    ConnectyCube.videochatconference.onRemoteStreamListener = (
      session,
      userId,
      stream
    ) => {
      participantRef.current.map((obj, id) => {
        if (obj.userId === userId) {
          obj.stream = stream;
        }
        return obj;
      });
      const newParticipants = [...participantRef.current];
      setParticipants(newParticipants);
    };
    ConnectyCube.videochatconference.onSlowLinkListener = (
      session,
      userId,
      uplink,
      nacks
    ) => {
      participantRef.current.filter((e) => {
        if (e.userId === userId) {
          e.connectionStatus = "average";
        }
        return e.connectionStatus;
      });
      setParticipants([...participantRef.current]);
      let existingSlowLinkTimer = slowLinkTimersRef.current[userId];
      if (existingSlowLinkTimer) {
        clearTimeout(existingSlowLinkTimer);
      }
      slowLinkTimersRef.current[userId] = setTimeout(() => {
        participantRef.current.filter((e) => {
          if (e.userId === userId) {
            e.connectionStatus = "good";
          }
          return e.connectionStatus;
        });
        setParticipants([...participantRef.current]);
      }, 9000);
    };
    ConnectyCube.videochatconference.onRemoteConnectionStateChangedListener = (
      session,
      userId,
      iceState
    ) => {};
    ConnectyCube.videochatconference.onSessionConnectionStateChangedListener = (
      session,
      iceState
    ) => {};

    navigator.mediaDevices.addEventListener("devicechange", function (event) {
      setDevices({ video: true, audio: true });
    });
    ConnectyCube.chat.onSystemMessageListener = (msg) => {
      let camera = document.getElementById(`user__cam-${msg.userId}`);
      if (msg.body === "camera__off") {
        camera.style.opacity = "0";
      } else if (msg.body === "camera__on") {
        camera.style.opacity = "1";
      }
    };
  };

  const createAndJoinMeeting = (
    userId,
    userLogin,
    userName,
    camClass,
    isVideo,
    isAudio
  ) => {
    return new Promise((resolve, reject) => {
      const params = {
        name: "My meeting",
        attendees: [],
        record: false,
        chat: true,
      };
      ConnectyCube.meeting
        .create(params)
        .then((meeting) => {
          meetingId.current = meeting._id;
          joinMeeting(userName, meeting._id, userId, camClass, isVideo, isAudio)
            .then((devices) => {
              setDevices(devices);

              resolve({
                meetingId: meeting._id,
              });
            })
            .catch((error) => {
              console.log("This error", error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  const joinMeeting = (
    userName,
    roomId,
    userId,
    camClass,
    isVideo,
    isAudio
  ) => {
    return new Promise((resolve, reject) => {
      createCallbacks();
      participantRef.current[0].userId = userId;
      setParticipants([...participantRef.current]);
      ConnectyCube.videochatconference
        .getMediaDevices()
        .then((allDevices) => {
          let mediaParams = mediaDevices(allDevices);
          if (!mediaParams.audio && !mediaParams.video) {
            reject("Error:You do not have any camera and microphone available");
            return;
          }
          const session = ConnectyCube.videochatconference.createNewSession();
          _session.current = session;

          setDevicesStatus({ video: isVideo, audio: isAudio });
          const devicesVisible = { video: isVideo, audio: isAudio };
          withVideo.current = isVideo;
          setIsVideoMuted(!devicesVisible.video);
          session
            .getUserMedia(devicesVisible)
            .then((localStream) => {
              if (!isVideo) {
                localStream.addTrack(createDummyVideoTrack());
              }
              participantRef.current.filter((p) => p.name === "me")[0].stream =
                localStream;

              const newParticipants = [...participantRef.current];
              setParticipants(newParticipants);
              ConnectyCube.videochatconference
                .getMediaDevices(
                  ConnectyCube.videochatconference.DEVICE_INPUT_TYPES.VIDEO
                )
                .then((videoDevices) => {
                  setChoosedCam(videoDevices[0].deviceId);
                  setCams(videoDevices);
                })
                .catch((error) => {
                  console.log(error);
                });
              session
                .join(roomId, userId, userName)
                .then(() => {
                  setIsLoaded(true);
                  setDevices(mediaParams);
                  resolve(mediaParams);
                })
                .catch((error) => {
                  console.log(error);
                  alert(JSON.stringify(error));
                  reject(error);
                });
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  const speakerNow = useRef(null);

  const leaveMeeting = () => {
    return new Promise((resolve, reject) => {
      ConnectyCube.destroySession();
      _session.current
        .leave()
        .then(() => {})
        .catch((error) => {
          console.log("You already left the room");
        });
      resolve();
    });
  };
  const speakerStream = (userId) => {
    participantRef.current.filter((p) => {
      if (p.userId === userId) {
        return p.userId;
      }
      return 0;
    });
  };

  const createDummyVideoTrack = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    const ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    console.log("[createDummyVideoTrack] tracks", stream.getTracks());
    const videoTrack = Object.assign(stream.getVideoTracks()[0], {
      enabled: false,
    });
    console.log("[createDummyVideoTrack] videoTrack", videoTrack);
    return videoTrack;
  };

  const enableVideo = () => {
    console.log("[enableVideo] ");
    participantRef.current.forEach((p) => {
      const userId = p.userId;
      const msg = {
        body: "camera__on",
        extension: {
          photo_uid: "7cafb6030d3e4348ba49cab24c0cf10800",
          name: "Our photos",
        },
      };
      let camera = document.getElementById("user__cam-me");
      camera.style.opacity = "1";
      ConnectyCube.chat.sendSystemMessage(userId, msg);
    });

    return new Promise((resolve, reject) => {
      let params = { video: true, audio: true };
      _session.current.getUserMedia(params, true).then(
        (stream) => {
          resolve(stream);
        },
        (error) => {
          console.error("[enableVideo] error", error, params);
          reject(error);
        }
      );
    });
  };

  const disableVideo = () => {
    participantRef.current.forEach((p) => {
      const userId = p.userId;
      const msg = {
        body: "camera__off",
        extension: {
          name: "Camera status",
        },
      };
      let camera = document.getElementById("user__cam-me");
      camera.style.opacity = "0";
      ConnectyCube.chat.sendSystemMessage(userId, msg);
    });

    console.log("[disableVideo]");
    let params = { video: false, audio: true };
    participantRef.current[0].stream.getVideoTracks()[0].stop();
    setParticipants([...participantRef.current]);
    return new Promise((resolve, reject) => {
      _session.current.getUserMedia(params, true).then(
        (stream) => {
          stream.addTrack(createDummyVideoTrack());
          console.log(stream);
          resolve(stream);
        },
        (error) => {
          console.error("[disableVideo] error", error, params);
          reject(error);
        }
      );
    });
  };

  const toggleAudio = () => {
    _session.current.isAudioMuted()
      ? _session.current.unmuteAudio()
      : _session.current.muteAudio();

    return _session.current.isAudioMuted();
  };

  const toggleVideo = () => {
    if (!isVideoMuted) {
      disableVideo().then((stream) => {
        participantRef.current[0].stream = stream;
        let updateStream = [...participantRef.current];
        setParticipants(updateStream);
        console.log(participants);
        setIsVideoMuted(true);
      });
    } else {
      enableVideo().then((stream) => {
        stream.getVideoTracks()[0].enabled = true;
        participantRef.current[0].stream = stream;
        let updateStream = [...participantRef.current];
        setParticipants(updateStream);
        setIsVideoMuted(false);
      });
    }
  };

  const switchCamera = (deviceId) => {
    if (deviceId !== choosedCam) {
      _session.current
        .switchMediaTracks({ video: deviceId })
        .then((newLocalStream) => {
          setChoosedCam(deviceId);
          newLocalStream.getVideoTracks()[0].enabled = true;
          participantRef.current[0].stream = newLocalStream;
          let updateStream = [...participantRef.current];
          setParticipants(updateStream);
          setIsVideoMuted(false);
        }) // you can reattach local stream
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const stopSharingScreen = () => {
    let screenShareButton = document.getElementById("share__btn");
    screenShareButton.classList.remove("sharing");
    let myCamera = document.getElementById("user__cam-me");
    myCamera.classList.remove("unmirror");
    return _session.current
      .getUserMedia(mediaParams, true)
      .then((stream) => {});
  };

  const startScreenSharing = () => {
    const constraints = {
      video: {
        width: 1280,
        height: 720,
        frameRate: { ideal: 10, max: 15 },
      },
      audio: true,
    };
    const blockVideo = document.getElementById("video_btn");
    blockVideo.disable = "true";
    _session.current
      .getDisplayMedia(constraints, true)
      .then((stream) => {
        stream.getVideoTracks()[0].enabled = true;
        stream
          .getVideoTracks()[0]
          .addEventListener("ended", () => stopSharingScreen());
      })
      .catch((error) => {
        stopSharingScreen();
      });
  };

  const recording = () => {
    if (!meetingIsRecording.current) {
      meetingIsRecording.current = true;
      ConnectyCube.meeting
        .update(meetingId.current, { record: true })
        .then((meeting) => {})
        .catch((error) => {
          console.log(error);
        });
    } else {
      meetingIsRecording.current = false;
      ConnectyCube.meeting
        .update(meetingId.current, { record: false })
        .then((meeting) => {})
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const viewChange = (newView) => {
    setView(newView);
  };
  return (
    <CallContext.Provider
      value={{
        toggleVideo,
        joinMeeting,
        createAndJoinMeeting,
        participants,
        toggleAudio,
        startScreenSharing,
        devices,
        cams,
        switchCamera,
        isiOS,
        isMobile,
        _session,
        stopSharingScreen,
        recording,
        view,
        viewChange,
        speakerStream,
        speakerNow,
        preJoinScreen,
        devicesStatus,
        chatId,
        leaveMeeting,
        isVideoMuted,
        isLoaded,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
