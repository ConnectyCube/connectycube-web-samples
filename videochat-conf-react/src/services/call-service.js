import ConnectyCube from "connectycube";
import { createContext, useEffect, useRef } from "react";
import { useState } from "react";
const CallContext = createContext();
export default CallContext;

export const CallProvider = ({ children }) => {
  const [participants, setParticipants] = useState([
    { userId: null, name: "Me", stream: null },
  ]);
  const participantRef = useRef([{ userId: null, name: "Me", stream: null }]);
  const [devices, setDevices] = useState({});
  const [cams, setCams] = useState();
  const isiOS = () => {
    return (
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  };
  useEffect(() => {
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
      console.log("We have camera");
      video = true;
    }
    if (allDevices.find((e) => e.kind === "audioinput")) {
      console.log("We have micro");
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
      console.log("User joined");

      participantRef.current.push({
        userId,
        name: userDisplayName,
        stream: null,
      });
      const newParticipants = [...participantRef.current];

      setParticipants(newParticipants);
    };
    ConnectyCube.videochatconference.onParticipantLeftListener = (
      session,
      userId
    ) => {
      console.log(1);

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
      console.warn("Stream", { session, userId, stream });

      participantRef.current.map((obj, id) => {
        if (obj.userId === userId) {
          obj.stream = stream;
          session.attachMediaStream(`user__cam-${userId}`, obj.stream);
        }
        return obj;
      });
      console.log(2);
    };
    ConnectyCube.videochatconference.onSlowLinkListener = (
      session,
      userId,
      uplink,
      nacks
    ) => {
      console.log(3);
    };
    ConnectyCube.videochatconference.onRemoteConnectionStateChangedListener = (
      session,
      userId,
      iceState
    ) => {
      console.log(4);
    };
    ConnectyCube.videochatconference.onSessionConnectionStateChangedListener = (
      session,
      iceState
    ) => {
      console.log(5);
    };
  };

  const createAndJoinMeeting = (userId, userLogin, userName, camClass) => {
    return new Promise((resolve, reject) => {
      const params = {
        name: "My meeting",
        attendees: [{ id: userId }],
        record: false,
        chat: false,
      };

      ConnectyCube.meeting
        .create(params)
        .then((meeting) => {
          joinMeeting(userName, meeting._id, userId, camClass)
            .then((devices) => {
              console.log(devices);
              setDevices(devices);
              debugger;

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

  const joinMeeting = (userName, roomId, userId, camClass) => {
    return new Promise((resolve, reject) => {
      createCallbacks();

      //Doesnt working for IOS
      ConnectyCube.videochatconference
        .getMediaDevices()
        .then((allDevices) => {
          let mediaParams = mediaDevs(allDevices);
          if (!mediaParams) {
            reject("Error:You do not have any camera and microphone available");
            return;
          }

          //let devices = { audio: mediaParams.audio, video: mediaParams.video };
          const session = ConnectyCube.videochatconference.createNewSession();
          _session.current = session;

          console.warn(roomId, userId, userName);
          session
            .getUserMedia(mediaParams)
            .then((localStream) => {
              debugger;
              session.attachMediaStream(`${camClass}-me`, localStream);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
          //   this.initListeners();
          session
            .join(roomId, userId, userName)
            .then(() => {})
            .catch((error) => {
              console.log(error);
              reject(error);
            });
          haveCamera(mediaParams).then((devices) => {
            resolve(devices);
          });
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  const haveCamera = (mediaParams) => {
    return new Promise((resolve, reject) => {
      let devices = { audio: mediaParams.audio, video: mediaParams.video };
      resolve(devices);
    });
  };
  const toggleAudio = () => {
    //session.muteAudio();
    _session.current.isAudioMuted()
      ? _session.current.unmuteAudio()
      : _session.current.muteAudio();
    console.log(
      _session.current.isAudioMuted() ? "Audio Muted" : "Audio Unmuted"
    );
    return _session.current.isAudioMuted();
  };
  const toggleVideo = () => {
    _session.current.isVideoMuted()
      ? _session.current.unmuteVideo()
      : _session.current.muteVideo();
    console.log(
      _session.current.isVideoMuted() ? "Video Muted" : "Video Unmuted"
    );
    return _session.current.isVideoMuted();
  };

  const switcher = () => {
    return new Promise((resolve, reject) => {
      ConnectyCube.videochatconference
        .getMediaDevices(
          ConnectyCube.videochatconference.DEVICE_INPUT_TYPES.VIDEO
        )
        .then((videoDevices) => {
          console.log(videoDevices);
        })
        .catch((error) => {});
      ConnectyCube.videochatconference
        .getMediaDevices(
          ConnectyCube.videochatconference.DEVICE_INPUT_TYPES.AUDIO
        )
        .then((audioDevices) => {
          resolve(audioDevices);
          debugger;
        })
        .catch((error) => {});
    });
  };

  const newCamera = (deviceId) => {
    _session.current
      .switchMediaTracks({ video: deviceId })
      .then((updatedLocaStream) => {
        console.log(updatedLocaStream);
      }) // you can reattach local stream
      .catch((error) => {
        console.log(error);
      });
  };
  const screenShare = () => {
    const constraints = {
      video: true,
      audio: true,
    };

    _session.current
      .getDisplayMedia(constraints)
      .then((localDesktopStream) => {
        console.log(localDesktopStream);
        alert("here");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <CallContext.Provider
      value={{
        toggleVideo,
        joinMeeting,
        createAndJoinMeeting,
        participants,
        toggleAudio,
        switcher,
        screenShare,
        devices,
        cams,
        newCamera,
        isiOS,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
