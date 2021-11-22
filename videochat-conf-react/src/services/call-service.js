import { isiOS, isMobile, detectBrowser } from "./heplers";
import ConnectyCube from "connectycube";
import { createContext, useEffect, useRef } from "react";
import { useState } from "react";
import { set } from "connectycube/lib/cubeConfig";
import { useHistory } from "react-router";
const CallContext = createContext();
export default CallContext;

export const CallProvider = ({ children }) => {
  const meetingIsRecording = useRef(true);
  const [view, setView] = useState("grid");
  const [preJoinScreen] = useState(false);
  const [choosedCam, setChoosedCam] = useState();
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCreator, setIsCreator] = useState("");
  const isVideoMutedRef = useRef(false);
  const href = useHistory();

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
      bitrate: "0 kbits/sec",
      micLevel: null,
      connectionStatus: "good",
      isVideo: false,
    },
  ]);

  console.log("participants", participants);

  const participantRef = useRef([
    {
      userId: null,
      name: "me",
      stream: null,
      bitrate: "0 kbits/sec",
      micLevel: null,
      connectionStatus: "good",
      isVideo: false,
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
              let safariBitrate = parseInt(bitrate);
              p.bitrate = Math.round(safariBitrate / 1000) + " kbits/sec";
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
    }, 4000);
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
        muted: false,
        mirror: false,
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
      const msg = {
        body: isVideoMutedRef.current ? "camera__off" : "camera__on",
        extension: {
          photo_uid: "7cafb6030d3e4348ba49cab24c0cf10800",
          name: "Our photos",
        },
      };

      ConnectyCube.chat.sendSystemMessage(userId, msg);
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
      }, 4000);
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

    if (isMobile) {
      ConnectyCube.chat.onSystemMessageListener = (msg) => {
        let camera = null;
        setTimeout(() => {
          if (msg.body === "camera__off") {
            participantRef.current.find(
              (p) => p.userId === msg.userId
            ).isVideo = false;
            setParticipants([...participantRef.current]);
          } else if (msg.body === "camera__on") {
            participantRef.current.find(
              (p) => p.userId === msg.userId
            ).isVideo = true;
            setParticipants([...participantRef.current]);
          }
        }, 6000);
      };
    } else {
      ConnectyCube.chat.onSystemMessageListener = (msg) => {
        let camera = null;
        setTimeout(() => {
          if (msg.body === "camera__off") {
            participantRef.current.find(
              (p) => p.userId === msg.userId
            ).isVideo = false;
            setParticipants([...participantRef.current]);
          } else if (msg.body === "camera__on") {
            participantRef.current.find(
              (p) => p.userId === msg.userId
            ).isVideo = true;
            setParticipants([...participantRef.current]);
          }
        }, 2000);
      };
    }
  };
  const oneMore = (userId, msg) => {
    let camera = document.getElementById(`user__cam-${userId}`);

    if (msg.body === "camera__off") {
      camera.classList.add("hide");
    } else if (msg.body === "camera__on") {
      camera.classList.remove("hide");
      console.error("Removed hide from ", userId);
    }
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
          if (userId === meeting.host_id) {
            setIsCreator("creator");
          }
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
          isVideoMutedRef.current = !devicesVisible.video;
          setIsVideoMuted(!devicesVisible.video);
          session
            .getUserMedia(devicesVisible)
            .then((localStream) => {
              if (!isVideo) {
                const dt = createDummyVideoTrack();
                localStream.addTrack(dt);
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
                  const msg = {
                    body: isVideo ? "camera__on" : "camera__off",
                    extension: {
                      photo_uid: "7cafb6030d3e4348ba49cab24c0cf10800",
                      name: "Our photos",
                    },
                  };

                  ConnectyCube.chat.sendSystemMessage(userId, msg);
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
  if (participantRef.current.length > 12) {
    leaveMeeting().then(() => {
      alert("Too much users for this room");
      window.location.pathname = "/";
    });
  }
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
    setInterval(() => {
      ctx.fillRect(0, 0, width, height);
    }, 500);
    ctx.fillRect(0, 0, width, height);
    let stream = canvas.captureStream(25);
    console.log("[createDummyVideoTrack]", stream.getTracks()[0]);
    const videoTrack = Object.assign(stream.getVideoTracks()[0], {
      enabled: true,
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
        isVideoMutedRef.current = true;

        setIsVideoMuted(true);
      });
    } else {
      enableVideo().then((stream) => {
        stream.getVideoTracks()[0].enabled = true;
        participantRef.current[0].stream = stream;
        let updateStream = [...participantRef.current];
        setParticipants(updateStream);
        isVideoMutedRef.current = false;

        setIsVideoMuted(false);
      });
    }
  };

  const switchCamera = (deviceId) => {
    if (deviceId !== choosedCam) {
      if (isMobile) {
        let myCamera = document.getElementById("user__cam-me");
        myCamera.classList.toggle("unmirror");
      }
      participantRef.current.forEach((p) => {
        const userId = p.userId;
        const msg = {
          body: "camera__on",
          extension: {
            photo_uid: "7cafb6030d3e4348ba49cab24c0cf10800",
            name: "Our photos",
          },
        };
        //   let camera = document.getElementById("user__cam-me");
        //   camera.style.opacity = "1";
        ConnectyCube.chat.sendSystemMessage(userId, msg);
      });
      _session.current
        .switchMediaTracks({ video: deviceId })
        .then((newLocalStream) => {
          setChoosedCam(deviceId);
          newLocalStream.getVideoTracks()[0].enabled = true;
          participantRef.current[0].stream = newLocalStream;
          let updateStream = [...participantRef.current];
          setParticipants(updateStream);
          isVideoMutedRef.current = false;

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
        isCreator,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
