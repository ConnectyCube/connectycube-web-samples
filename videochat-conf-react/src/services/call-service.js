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
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [devicesStatus, setDevicesStatus] = useState({
    video: true,
    audio: true,
  });
  const withVideo = useRef(true);
  const [participants, setParticipants] = useState([
    {
      userId: null,
      name: "Me",
      stream: null,
      bitrate: null,
      micLevel: null,
      connectionStatus: "good",
    },
  ]);
  const participantRef = useRef([
    {
      userId: null,
      name: "Me",
      stream: null,
      bitrate: null,
      micLevel: null,
      connectionStatus: "good",
    },
  ]);

  const slowLinkTimersRef = useRef({});

  const MAX_MIC_LEVEL = 20000;
  const meetingId = useRef(null);
  const [devices, setDevices] = useState({});
  const [cams, setCams] = useState();
  let mediaParams = {
    video: { width: 1280, height: 720 },
    audio: true,
  };

  useEffect(() => {
    setInterval(() => {
      participantRef.current.forEach((p) => {
        if (p.name !== "Me") {
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
    ConnectyCube.videochatconference
      .getMediaDevices(
        ConnectyCube.videochatconference.DEVICE_INPUT_TYPES.VIDEO
      )
      .then((videoDevices) => {
        setCams(videoDevices);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const _session = useRef(null);
  const mediaDevs = (allDevices) => {
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
          // session.attachMediaStream(`user__cam-${userId}`, obj.stream);
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
        chat: false,
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
      ConnectyCube.videochatconference
        .getMediaDevices()
        .then((allDevices) => {
          let mediaParams = mediaDevs(allDevices);
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
              participantRef.current.filter((p) => p.name === "Me")[0].stream =
                localStream;

              const newParticipants = [...participantRef.current];
              setParticipants(newParticipants);
              session
                .join(roomId, userId, userName)
                .then(() => {
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
    console.log("[enableVideo]");

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
    _session.current
      .switchMediaTracks({ video: deviceId })
      .then((newLocalStream) => {}) // you can reattach local stream
      .catch((error) => {
        console.log(error);
      });
  };

  const stopSharingScreen = () => {
    let screenShareButton = document.getElementById("share__btn");
    screenShareButton.classList.remove("sharing");
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

    _session.current
      .getDisplayMedia(constraints, true)
      .then((stream) => {
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
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
