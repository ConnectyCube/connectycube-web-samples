import ConnectyCube from "connectycube";
import ReactContext from "../redux/state";

class CallService {
  initListeners() {
    ConnectyCube.videochatconference.onParticipantJoinedListener =
      this.onParticipantJoinedListener;

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
  }

  onParticipantJoinedListener = (
    session,
    userId,
    userDisplayName,
    isExistingParticipant
  ) => {
	  debugger
	<ReactContext.Provider value = {userId}>
		
	</ReactContext.Provider>
    console.log("OnJoin", { userId, userDisplayName, isExistingParticipant });
  };

  createAndJoinMeeting = (userId) => {
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
          this.initListeners();
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
              session.attachMediaStream("user__cam", localStream);

              console.log(meeting._id);

              console.warn(meeting._id, userId, "Atal");
              session
                .join(meeting._id, userId, "Atal")
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

  joinMeeting = (userName, roomId, user) => {
    this.initListeners();
    const session = ConnectyCube.videochatconference.createNewSession();
    const mediaParams = {
      audio: true,
      video: true,
      options: {
        muted: true,
        mirror: true,
      },
    };
    console.warn(roomId, user, userName);
    session
      .getUserMedia(mediaParams)
      .then((localStream) => {
        session.attachMediaStream(`user__cam`, localStream);

        //   this.initListeners();
        session
          .join(roomId, user, "Atal21")
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  turnDownVideo = () => {
    this.session.muteVideo();
  };
}

const Call = new CallService();
export default Call;
