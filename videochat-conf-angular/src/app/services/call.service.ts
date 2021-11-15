import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "../reducers";
import {addUser, removeUser, updateUser} from "../reducers/participant.actions";
import {constraints, mediaParams} from "./config";

declare let ConnectyCube: any;

@Injectable({
  providedIn: 'root'
})
export class CallService {
  constructor(
    private store: Store<State>
  ) {
  }

  private OurSession: any;
  private OurDeviceId: any;
  private OurSharingStatus: any;

  private static generateMeetRoomURL(confRoomId: string): string {
    return btoa(confRoomId);
  }

  private createDummyVideoTrack = ({width = 640, height = 480} = {}) => {
    let canvas: any = Object.assign(document.createElement("canvas"), {width, height});
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    console.log("[createDummyVideoTrack] tracks", stream.getTracks());
    const videoTrack = Object.assign(stream.getVideoTracks()[0], {enabled: true});
    console.log("[createDummyVideoTrack] videoTrack", videoTrack);
    return videoTrack;
  }

  public init() {
    ConnectyCube.videochatconference.onParticipantJoinedListener = (
      session: any,
      userId: any,
      userDisplayName: any,
      isExistingParticipant: any
    ) => {
      this.store.dispatch(addUser({id: userId, name: userDisplayName}));
    };
    ConnectyCube.videochatconference.onParticipantLeftListener
      = (session: any, userId: any) => {
      this.store.dispatch(removeUser({id: userId}));
    };
    ConnectyCube.videochatconference.onRemoteStreamListener
      = (session: any, userId: any, stream: any) => {
      this.store.dispatch(updateUser({id: userId, stream: stream}));
    };
    ConnectyCube.videochatconference.onSlowLinkListener
      = (session: any, userId: any, uplink: any, nacks: any) => {
    };
    ConnectyCube.videochatconference.onRemoteConnectionStateChangedListener
      = (session: any, userId: any, iceState: any) => {
    };
    ConnectyCube.videochatconference.onSessionConnectionStateChangedListener
      = (session: any, iceState: any) => {
    };
  }

  public SetOurDeviceId(id: any) {
    this.OurDeviceId = id;
  }

  public muteOrUnmuteMicro() {
    return new Promise<void>((resolve, reject) => {
      try {
        const session = this.OurSession;
        if (session.isAudioMuted()) {
          session.unmuteAudio();
        }
        else {
          session.muteAudio();
        }
        resolve();
      }
      catch (error: any) {
        console.log("MuteOrUnmuteMicro Error!", error);
        reject();
      }
    })
  }


  public muteOrUnmuteVideo(videoWork: boolean) {
    return new Promise<void>((resolve, reject) => {
      try {
        const mediaParamsDeviceId = {
          audio: true,
          video: {deviceId: this.OurDeviceId}
        }

        const session = this.OurSession;

        console.log(videoWork)

        if (!videoWork) {
          session.getUserMedia(mediaParamsDeviceId, true)
            .then((stream: any) => {
              this.store.dispatch(updateUser({id: 77777, stream: stream}));
              console.log("IF", stream.getVideoTracks());
            })
        }
        else {
          session.getUserMedia({audio: true}, true)
            .then((stream: any) => {
              stream.addTrack(this.createDummyVideoTrack());
              this.store.dispatch(updateUser({id: 77777, stream: stream}));
              console.log("ELSE", stream.getVideoTracks());
            })
        }


        console.log("LOCAL STREAM", session.localStream.getVideoTracks());
        resolve();
      }
      catch (error: any) {
        console.log("MuteOrUnmuteVideo Error!", error);
        reject();
      }
    })
  }

  public stopCall() {
    return this.OurSession.leave();
  }

  public getListDevices() {
    return ConnectyCube.videochatconference
      .getMediaDevices(ConnectyCube.videochatconference.DEVICE_INPUT_TYPES.VIDEO);
  }

  public switchCamera(deviceId: string, videoIcon: string) {
    return new Promise<void>((resolve, reject) => {
      this.OurDeviceId = deviceId;
      const session = this.OurSession;

      const mediaParamsDeviceId = {
        audio: true,
        video: {deviceId: deviceId}
      }

      session
        .switchMediaTracks({video: deviceId})
        .then((updatedLocaStream: any) => {
          if (videoIcon === 'videocam_off') {
            resolve();
          }
          this.store.dispatch(updateUser({id: 77777, stream: updatedLocaStream}));
        })
        .catch((error: any) => {
          console.log("Switch camera Error!", error);
        });
    })
  }

  public stopSharingScreen() {
    const mediaParamsDeviceId = {
      audio: true,
      video: {deviceId: this.OurDeviceId}
    }
    const session = this.OurSession;
    session.localStream.getTracks().forEach((item: any) => {
      item.stop();
    });
    session.getUserMedia(mediaParamsDeviceId)
      .then((stream: any) => {
        this.store.dispatch(updateUser({id: 77777, stream: stream}));
        this.OurSharingStatus = false;
      })
      .catch((error: any) => {
        console.log("Stop sharing Error!", error);
      })
  }

  public shareScreen() {
    return new Promise<any>((resolve, reject) => {
      const shareStatus = this.OurSharingStatus;
      if (shareStatus) {
        reject();
      }
      else {
        const session = this.OurSession;
        session
          .getDisplayMedia(constraints, true)
          .then((localDesktopStream: any) => {
            this.store.dispatch(updateUser({id: 77777, stream: localDesktopStream}));
            this.OurSharingStatus = true;
            resolve(localDesktopStream);
          })
          .catch((error: any) => {
            if (error.message.includes('Permission denied')) {
              reject();
            }
            else {
              console.log("Share screen Error!", error);
              reject(error);
            }
          });
      }
    })
  }

  public getLocalUserVideo() {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  public joinUser(confRoomId: string, userId: number, userDisplayName: string) {
    return new Promise<string>((resolve, reject) => {
      const session = this.createSession();
      this.OurSession = session;

      const mediaParamsDeviceId = {
        audio: true,
        video: {deviceId: this.OurDeviceId}
      }

      const params = this.OurDeviceId && mediaParams.video ? mediaParamsDeviceId : mediaParams;

      console.log("PARAMS", params);
      console.log(this.OurDeviceId);

      session.getUserMedia(params)
        .then((stream: any) => {
          console.log(mediaParams);
          if (!mediaParams.video) {
            stream.addTrack(this.createDummyVideoTrack());
          }
          this.store.dispatch(addUser({id: 77777, name: userDisplayName, stream: stream}));

          session.join(confRoomId, userId, userDisplayName);

          resolve(CallService.generateMeetRoomURL(confRoomId));
        })
        .catch((error: any) => {
          console.log("Local stream Error!", error);
          reject();
        })
    })
  }

  public createSession() {
    return ConnectyCube.videochatconference.createNewSession();
  }

  public createMeetingAndJoin(user: any) {
    return new Promise<string>((resolve, reject) => {
      const params = {
        name: "My meeting",
        attendees: [
          {id: user.id}
        ],
        record: false,
        chat: false
      };

      ConnectyCube.meeting.create(params)
        .then((meeting: any) => {
          return meeting._id;
        })
        .then((confRoomId: string) => {
          this.joinUser(confRoomId, user.id, user.name).then((roomUrl: string) => {
            resolve(roomUrl);
          })
        })
        .catch((error: any) => {
          console.log("Create meeting Error!", error);
          reject();
        });
    })
  }
}
