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
  const isMobile =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
      navigator.userAgent || navigator.vendor || window.opera
    ) ||
    // eslint-disable-next-line
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      (navigator.userAgent || navigator.vendor || window.opera).substr(0, 4)
    );
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

      // //Doesnt working for IOS
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

          // alert(JSON.stringify(mediaParams));
          session
            .getUserMedia(mediaParams)
            .then((localStream) => {
              //     //   this.initListeners();
              session
                .join(roomId, userId, userName)
                .then(() => {
                  resolve(mediaParams);
                  setTimeout(() => {
                    session.attachMediaStream(`${camClass}-me`, localStream, {
                      muted: true,
                    });
                  }, 1000);
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
        })
        .catch((error) => {});
    });
  };

  const newCamera = (deviceId) => {
    _session.current
      .switchMediaTracks({ video: deviceId })
      .then((newLocalStream) => {
        console.log(newLocalStream);
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
        isMobile,
        _session,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
