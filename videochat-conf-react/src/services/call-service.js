import { isiOS, isMobile, detectBrowser } from "./heplers";
import ConnectyCube from "connectycube";
import { createContext, useEffect, useRef } from "react";
import { useState } from "react";
import sound from "../sounds/notification_sound.mp3";
const CallContext = createContext();
export default CallContext;

export const CallProvider = ({ children }) => {
  const meetingIsRecording = useRef(true);
  const [view, setView] = useState("grid");
  const [preJoinScreen] = useState(false);
  const [choosedCam, setChoosedCam] = useState();
  const [isVideoMuted, setIsVideoMuted] = useState(false);

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

  const [messages, setMessages] = useState([]);
  console.log("MSGS", messages);
  const messagesRef = useRef([]);
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
  const [devices, setDevices] = useState({});
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
      debugger;
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

    ConnectyCube.chat.onMessageListener = (userId, message) => {
      console.log(
        "[ConnectyCube.chat.onMessageListener] callback:",
        userId,
        message
      );
      if (userId !== participantRef.current[0].userId) {
        let audio = new Audio(sound);
        audio.play();
      }

      message.sender_id = userId;
      message.message = message.body;
      processMessages([message]).then((msgs) => {
        console.log("[ConnectyCube.chat.onMessageListener]:", messages, msgs);
        messagesRef.current = messagesRef.current.concat(msgs);
        setMessages(messagesRef.current);
      });
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
  const processMessages = async (records) => {
    const messagesBySender = {};
    records.forEach((m) => {
      let msgs = messagesBySender[m.sender_id];
      if (!msgs) {
        msgs = [];
      }
      msgs.push(m);
      messagesBySender[m.sender_id] = msgs;
    });

    for (let senderId of Object.keys(messagesBySender)) {
      // find user
      const notFoundUsersIds = [];

      for (let i = 0; i < participantRef.current.length; i += 1) {
        let participant = participantRef.current[i];
        if (participant.userId === parseInt(senderId)) {
          const name = i === 0 ? "me" : participant.name;
          messagesBySender[senderId].forEach((m) => {
            m.senderName = name;
          });
          break;
        } else {
          notFoundUsersIds.push(senderId);
        }
      }

      // console.log("notFoundUsersIds", notFoundUs?ersIds);
      if (notFoundUsersIds.length > 0) {
        const params = {
          filter: {
            field: "id",
            param: "in",
            value: notFoundUsersIds.map((id) => parseInt(id)),
          },
        };

        const users = await ConnectyCube.users.get(params);
        users.items.forEach((rec) => {
          const uID = rec.user.id;
          console.log("messagesBySender", messagesBySender, uID);
          messagesBySender[uID].forEach((m) => {
            m.senderName = rec.user.full_name;
          });
        });
      }
    }

    return records;
  };

  const joinChat = (roomId) => {
    ConnectyCube.meeting
      .get({ _id: roomId })
      .then((meeting) => {
        chatId.current = meeting.chat_dialog_id;
        ConnectyCube.chat.dialog
          .subscribe(meeting.chat_dialog_id)
          .then((dialog) => {
            const params = {
              chat_dialog_id: meeting.chat_dialog_id,
              sort_desc: "date_sent",
              limit: 100,
              skip: 0,
            };

            ConnectyCube.chat.message
              .list(params)
              .then((resp) => {
                console.table(resp.items);
                processMessages(resp.items).then((msgs) => {
                  console.table(msgs);
                  messagesRef.current = msgs;
                  setMessages(msgs);
                });
              })
              .catch((error) => {});
          })
          .catch((error) => {
            console.error(error);
          })
          .catch((error) => {});
      })
      .catch((error) => {});
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
              participantRef.current.filter((p) => p.name === "me")[0].stream =
                localStream;

              const newParticipants = [...participantRef.current];
              setParticipants(newParticipants);

              session
                .join(roomId, userId, userName)
                .then(() => {
                  joinChat(roomId);
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
        .catch((error) => {});
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
    if (deviceId !== choosedCam) {
      _session.current
        .switchMediaTracks({ video: deviceId })
        .then((newLocalStream) => {
          setChoosedCam(deviceId);
        }) // you can reattach local stream
        .catch((error) => {
          console.log(error);
        });
    }
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
        chatId,
        messages,
        leaveMeeting,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
