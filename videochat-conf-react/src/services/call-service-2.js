import ConnectyCube from "connectycube";
import { createContext } from "react";
import { rerenderTree } from "..";
import { useState } from "react";
const CallContext = createContext();
export default CallContext;

export const CallProvider = ({ children }) => {
  const participants = [];

  ConnectyCube.videochatconference.onParticipantLeftListener = (
    session,
    userId
  ) => {
    console.log(1);
  };
  ConnectyCube.videochatconference.onRemoteStreamListener = (
    session,
    userId,
    stream
  ) => {
    console.warn("Stream", { session, userId, stream });

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

  ConnectyCube.videochatconference.onRemoteStreamListener = (
    session,
    userId,
    stream
  ) => {
    console.warn("Stream", { session, userId, stream });
  };
  ConnectyCube.videochatconference.onParticipantJoinedListener = (
    session,
    userId,
    userDisplayName,
    isExistingParticipant
  ) => {
    console.log("OnJoin", { userId, userDisplayName, isExistingParticipant });
    participants.push({ userId: userId, userName: localStorage.userName });
    alert("rerenderes");
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
          ConnectyCube.videochatconference.onParticipantJoinedListener = (
            session,
            userId,
            userDisplayName,
            isExistingParticipant
          ) => {
            participants.push({
              userId: userId,
              userName: localStorage.userName,
            });
            console.log(participants);
            console.log("OnJoin", {
              userId,
              userDisplayName,
              isExistingParticipant,
            });
          };
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
              session.attachMediaStream(`user__cam`, localStream);
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
    ConnectyCube.videochatconference.onParticipantJoinedListener = (
      session,
      userId,
      userDisplayName,
      isExistingParticipant
    ) => {
      participants.push(userId, userName);
      console.log(participants);
      console.log("OnJoin", { userId, userDisplayName, isExistingParticipant });
    };
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
        session.attachMediaStream(`user__cam`, localStream);

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
      value={{ turnDownVideo, joinMeeting, createAndJoinMeeting, participants }}
    >
      {children}
    </CallContext.Provider>
  );
};
