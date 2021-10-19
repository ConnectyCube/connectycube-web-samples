import ConnectyCube from "connectycube";
import { createContext, useRef } from "react";
import { useState } from "react";
const CallContext = createContext();
export default CallContext;

export const CallProvider = ({ children }) => {
  const [participants, setParticipants] = useState([
    { userId: null, name: "Me", stream: null },
  ]);
  const participantRef = useRef([{ userId: null, name: "Me", stream: null }]);

  const mediaDevs = (allDevices) => {
    let video = false;
    let audio = false;
    if (allDevices.find((e) => e.kind == "videoinput")) {
      console.log("We have camera");
      video = true;
    }
    if (allDevices.find((e) => e.kind == "audioinput")) {
      console.log("We have micro");
      audio = true;
    }
    let mediaParams = {
      audio: true,
      video: true,
      options: {
        muted: true,
        mirror: true,
      },
    };

    if (audio && video) {
      return (mediaParams = {
        audio: true,
        video: true,
        options: {
          muted: true,
          mirror: true,
        },
      });
    } else if (audio && !video) {
      return (mediaParams = {
        audio: true,
        video: false,
        options: {
          muted: true,
          mirror: true,
        },
      });
      console.log("worked we have micro");
    } else if (!audio && video) {
      return (mediaParams = {
        audio: false,
        video: true,
        options: {
          muted: true,
          mirror: true,
        },
      });
    }
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
            .then(() => {
              resolve(meeting._id);
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

  const joinMeeting = (userName, roomId, userId, camClass) => {
    return new Promise((resolve, reject) => {
      createCallbacks();
      ConnectyCube.videochatconference
        .getMediaDevices()
        .then((allDevices) => {
          let mediaParams = mediaDevs(allDevices);
          if (!mediaParams) {
            reject("Error:You do not have any camera and microphone available");
            return;
          }
          const session = ConnectyCube.videochatconference.createNewSession();

          console.warn(roomId, userId, userName);
          session
            .getUserMedia(mediaParams)
            .then((localStream) => {
              session.attachMediaStream(`${camClass}-me`, localStream);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
          //   this.initListeners();
          session
            .join(roomId, userId, userName)
            .then(() => {
              resolve();
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

  let turnDownVideo = () => {
    
    console.log("Hey i am used");
    return "Hey Hey";
  };

  return (
    <CallContext.Provider
      value={{
        turnDownVideo,
        joinMeeting,
        createAndJoinMeeting,
        participants,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
