declare let ConnectyCube: any;

class CallService {
  public createMeeting(userId: number) {
    const params = {
      name: "My meeting",
      attendees: [
        {id: userId}
      ],
      record: false,
      chat: false
    };

    const mediaParams = {
      audio: true,
      video: true
    };

    ConnectyCube.meeting.create(params)
      .then((meeting: any) => {
        const confRoomId = meeting._id;
      })
      .then(() => {
        const session = ConnectyCube.videochatconference.createNewSession();
        session
          .getUserMedia(mediaParams)
          .then((localStream: any) => {
            session.attachMediaStream("stream-me", localStream, {
              muted: true,
              mirror: true
            });

          })
          .catch((error: any) => {
            console.log("Local stream Error!", error);
          })
      })
      .catch((error: any) => {
        console.log("Create meeting Error!", error);
      });
  }
}

export const callServices = Object.freeze(new CallService());
