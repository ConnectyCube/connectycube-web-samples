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
  const [isCreator, setIsCreator] = useState("");
  const isVideoMutedRef = useRef(false);
  const [mirror, setMirror] = useState(false);
  const sharingRef = useRef(false);

  const [devicesStatus, setDevicesStatus] = useState({
    video: true,
    audio: true,
  });
  const withVideo = useRef(true);
  const prevIsVideoRef = useRef(true);
  const [participants, setParticipants] = useState([
    {
      userId: null,
      name: "me",
      stream: null,
      bitrate: "0 kbits/sec",
      micLevel: null,
      connectionStatus: "good",
      isVideo: false,
      isSharing: false,
      isMicroMuted: false,
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
      isSharing: false,
      isMicroMuted: false,
    },
  ]);

  const slowLinkTimersRef = useRef({});

  const MAX_MIC_LEVEL = 20000;
  const meetingId = useRef(null);
  const chatId = useRef(null);
  const [devices, setDevices] = useState({ video: false, audio: false });
  const [cams, setCams] = useState();
  let mediaParams = {
    video: { width: 1920, height: 1080 },
    audio: true,
  };

  useEffect(() => {
    setInterval(async () => {
      for (let p of participantRef.current) {
        if (p.name !== "me") {
          try {
            let bitrate = _session.current.getRemoteUserBitrate(p.userId);
            let micLevel = (await _session.current.getRemoteUserVolume(p.userId) || 0) * 100;
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
      }
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
      let user = participantRef.current.find(
        (participant) => participant.userId === userId
      );
      if (!user) {
        participantRef.current.push({
          userId,
          name: userDisplayName,
          stream: null,
          connectionStatus: "good",
        });
      } else {
        participantRef.current.map((obj, id) => {
          if (obj.userId === userId) {
            obj.name = userDisplayName;
          }
          return obj;
        });
        const newParticipants = [...participantRef.current];
        setParticipants(newParticipants);
      }
      const isVideoMuted = {
        body: isVideoMutedRef.current ? "camera__off" : "camera__on",
        extension: {
          photo_uid: "7cafb6030d3e4348ba49cab24c0cf10800",
          name: "Our photos",
        },
      };
      const microStatus = {
        body: participantRef.current[0].isMicroMuted
          ? "micro__muted"
          : "micro__unmuted",
        extension: {
          photo_uid: "7cafb6030d3e4348ba49cab24c0cf10800",
          name: "Our photos",
        },
      };
      const sharingStatus = {
        body: participantRef.current[0].isSharing ? "sharing" : "not-sharing",
        extension: {
          photo_uid: "7cafb6030d3e4348ba49cab24c0cf10800",
          name: "Our photos",
        },
      };

      ConnectyCube.chat.sendSystemMessage(userId, sharingStatus);
      ConnectyCube.chat.sendSystemMessage(userId, microStatus);
      ConnectyCube.chat.sendSystemMessage(userId, isVideoMuted);
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
      console.table(participantRef.current);
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

    ConnectyCube.chat.onSystemMessageListener = (msg) => {
      let user = participantRef.current.find(
        (participant) => participant.userId === msg.userId
      );
      if (!user) {
        participantRef.current.push({
          userId: msg.userId,
          stream: null,
          connectionStatus: "good",
        });
        setParticipants([...participantRef.current]);
      }
      if (msg.extension.sharing === "sharing" || msg.body === "sharing") {
        participantRef.current.find(
          (p) => p.userId === msg.userId
        ).isSharing = true;
      } else if (
        msg.extension.sharing === "not-sharing" ||
        msg.body === "not-sharing"
      ) {
        participantRef.current.find(
          (p) => p.userId === msg.userId
        ).isSharing = false;
      }
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
      if (msg.body === "micro__muted") {
        participantRef.current.find(
          (p) => p.userId === msg.userId
        ).isMicroMuted = true;
        setParticipants([...participantRef.current]);
      } else if (msg.body === "micro__unmuted") {
        participantRef.current.find(
          (p) => p.userId === msg.userId
        ).isMicroMuted = false;
        setParticipants([...participantRef.current]);
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
      let params = { video: mediaParams, audio: true };
      _session.current.getUserMedia(mediaParams, true).then(
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

    let params = { video: false, audio: true };
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
    if (_session.current.isAudioMuted()) {
      participantRef.current.forEach((p) => {
        const userId = p.userId;
        const msg = {
          body: "micro__unmuted",
          extension: {
            photo_uid: "7cafb6030d3e4348ba49cab24c0cf10800",
            name: "Our photos",
          },
        };
        ConnectyCube.chat.sendSystemMessage(userId, msg);
      });

      _session.current.unmuteAudio();
    } else {
      participantRef.current.forEach((p) => {
        const userId = p.userId;
        const msg = {
          body: "micro__muted",
          extension: {
            photo_uid: "7cafb6030d3e4348ba49cab24c0cf10800",
            name: "Our photos",
          },
        };
        ConnectyCube.chat.sendSystemMessage(userId, msg);
      });
      _session.current.muteAudio();
    }

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
      if (sharingRef.current) {
        stopSharingScreen();
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
    setMirror(false);
    sharingRef.current = false;

    participantRef.current[0].isVideo = prevIsVideoRef.current;
    if (prevIsVideoRef.current) {
      participantRef.current.forEach((p) => {
        const userId = p.userId;
        const msg = {
          body: "camera__on",
          extension: {
            sharing: "not-sharing",
            name: "Our photos",
          },
        };
        ConnectyCube.chat.sendSystemMessage(userId, msg);
      });
      return _session.current
        .getUserMedia({ video: true, audio: true }, true)
        .then((stream) => {});
    } else if (!prevIsVideoRef.current) {
      participantRef.current.forEach((p) => {
        const userId = p.userId;
        const msg = {
          body: "camera__off",
          extension: {
            sharing: "not-sharing",
            name: "Our photos",
          },
        };

        ConnectyCube.chat.sendSystemMessage(userId, msg);
      });
      return _session.current
        .getUserMedia({ video: false, audio: true }, true)
        .then((stream) => {});
    }
  };

  const startScreenSharing = () => {
    sharingRef.current = true;
    return new Promise((resolve, reject) => {
      const constraints = {
        video: {
          width: 1920,
          height: 1080,
          frameRate: { ideal: 10, max: 15 },
        },
        audio: true,
      };

      const blockVideo = document.getElementById("video_btn");
      blockVideo.disable = "true";
      _session.current
        .getDisplayMedia(constraints, true)
        .then((stream) => {
          prevIsVideoRef.current = participantRef.current[0].isVideo;

          participantRef.current.forEach((p) => {
            const userId = p.userId;
            const msg = {
              body: "camera__on",
              extension: {
                sharing: "sharing",
                name: "Our photos",
              },
            };

            ConnectyCube.chat.sendSystemMessage(userId, msg);
          });

          stream.getVideoTracks()[0].enabled = true;
          setMirror(true);
          stream.getVideoTracks()[0].addEventListener("ended", () => {
            setMirror(false);
            participantRef.current[0].isVideo = prevIsVideoRef.current;
            stopSharingScreen();
          });
        })
        .catch((error) => {
          participantRef.current[0].isVideo = prevIsVideoRef.current;

          setMirror(false);
        });
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
        mirror,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
