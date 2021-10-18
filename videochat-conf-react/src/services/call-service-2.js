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
          session.attachMediaStream(`user__cam ${userId}`, obj.stream);
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

  const createAndJoinMeeting = (userId, userLogin, userName) => {
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
          createCallbacks();

          const session = ConnectyCube.videochatconference.createNewSession();

          const mediaParams = {
            audio: true,
            video: true,
            options: {
              muted: true,
              mirror: true,
            },
          };
          session
            .getUserMedia(mediaParams)
            .then((localStream) => {
              session.attachMediaStream(`user__cam null`, localStream);
              console.log(meeting._id);
              console.warn(meeting._id, userId, userName);
              session
                .join(meeting._id, userId, userName)
                .then(() => {
                  const confRoomId = session.currentRoomId;
                  console.log("HERE is " + confRoomId);

                  resolve(confRoomId);
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
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  const joinMeeting = (userName, roomId, userId) => {
    createCallbacks();

    const session = ConnectyCube.videochatconference.createNewSession();
    const mediaParams = {
      audio: true,
      video: true,
      options: {
        muted: true,
        mirror: true,
      },
    };
    console.warn(roomId, userId, userName);
    session
      .getUserMedia(mediaParams)
      .then((localStream) => {
        session.attachMediaStream(
          `user__cam ${participantRef.current[0].userId}`,
          localStream
        );

        //   this.initListeners();
        session
          .join(roomId, userId, userName)
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
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
