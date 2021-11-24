import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "../reducers";
import {
  addBitrate,
  addMicrophoneLevel,
  addUser,
  removeUser,
  updateConnectionStatus,
  updateUser
} from "../reducers/participant.actions";
import {constraints, mediaParams} from "./config";
import {User} from "../reducers/participant.reducer";
import {participantSelector, participantSortSelector} from "../reducers/participant.selectors";
import {take} from "rxjs/operators";

declare let ConnectyCube: any;

@Injectable({
  providedIn: 'root'
})
export class CallService {
  constructor(
    private store: Store<State>
  ) {
  }

  private UPDATE_STREAM_TIME: number = 4000;
  private CONNECTION_UPDATE_STATUS_TIME = 30 * 1000;
  private OurSession: any;
  private OurDeviceId: any;
  private OurSharingStatus: any;
  private OurIntervalId: any;
  private subscribeParticipantArray: any;
  private participantArray: any;
  private currentMode: string = 'grid';
  private participantArray$ = this.store.select(participantSelector);
  private slowLinkTimers: any = {};

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
      userId: number,
      userDisplayName: string,
      isExistingParticipant: any
    ) => {
      this.store.dispatch(addUser({
        id: userId,
        name: userDisplayName,
        volumeLevel: 0,
        bitrate: '',
        connectionStatus: 'good'
      }));

      if (this.subscribeParticipantArray) {
        this.stopCheckUserMicLevel();
      }

      this.startCheckUsersMicLevel(session);

    };
    ConnectyCube.videochatconference.onParticipantLeftListener
      = (session: any, userId: number) => {
      this.store.dispatch(removeUser({id: userId}));
      this.stopCheckUserMicLevel();

      this.participantArray$.pipe(take(1)).subscribe(res => {
        this.participantArray = res;
        console.warn("[PARTICIPANT ARRAY AFTER REMOVE]", this.participantArray);
      });

      if (this.participantArray.length < 2) {
        this.currentMode = 'grid';
      }
      else {
        this.startCheckUsersMicLevel(session);
      }
    };
    ConnectyCube.videochatconference.onRemoteStreamListener
      = (session: any, userId: number, stream: any) => {
      this.store.dispatch(updateUser({id: userId, stream: stream}));
    };
    ConnectyCube.videochatconference.onSlowLinkListener
      = (session: any, userId: number, uplink: any, nacks: any) => {
      this.store.dispatch(updateConnectionStatus({id: userId, connectionStatus: 'average'}));

      const timerId = this.slowLinkTimers[userId];
      if (timerId) {
        clearTimeout(timerId);
      }

      this.slowLinkTimers[userId] = setTimeout(() => {
        this.store.dispatch(updateConnectionStatus({id: userId, connectionStatus: 'good'}))
      }, this.CONNECTION_UPDATE_STATUS_TIME);
    };
    ConnectyCube.videochatconference.onRemoteConnectionStateChangedListener
      = (session: any, userId: any, iceState: any) => {
    };
    ConnectyCube.videochatconference.onSessionConnectionStateChangedListener
      = (session: any, iceState: any) => {
    };
  }

  public setCurrentMode(mode: string) {
    this.currentMode = mode;
  }

  public getParticipantArrayLength() {
    return this.participantArray.length;
  }

  public startCheckUsersMicLevel(session: any) {
    console.log("[StartCheckUsersMic]");
    this.OurIntervalId = setInterval(this.getUsersMicLevel.bind(this), this.UPDATE_STREAM_TIME, session);
  }

  public stopCheckUserMicLevel() {
    console.log("[StopCheckUsersMic]");
    this.subscribeParticipantArray.unsubscribe();
    clearInterval(this.OurIntervalId);
  }

  public getUsersBitrate(session: any) {
    const idBitrateMap: Map<number, string> = new Map;
    console.warn(this.participantArray);
    this.participantArray.forEach((user: User) => {
      if (user.bitrate !== undefined) {
        idBitrateMap.set(user.id, session.getRemoteUserBitrate(user.id));
      }
    })
    console.warn('Bitrate', idBitrateMap);
    this.store.dispatch(addBitrate({idBitrateMap: idBitrateMap}))
  }

  public getUsersMicLevel(session: any) {
    //Get listener to Participants array and get participantArray if change
    this.subscribeParticipantArray = this.participantArray$.pipe(take(1)).subscribe(res => {
      this.participantArray = res;
    });

    console.warn("[PARTICIPANT ARRAY]", this.participantArray);

    this.getUsersBitrate(session);

    if (this.currentMode === 'grid') {
      return;
    }

    console.log("[getUsersMicLevel 15s]");
    const idVolumeLevelMap: Map<number, number> = new Map;
    this.participantArray.forEach((user: User) => {
      if (user.volumeLevel !== undefined) {
        idVolumeLevelMap.set(user.id, Number(session.getRemoteUserVolume(user.id)));
      }
    })
    this.store.dispatch(addMicrophoneLevel({idVolumeLevelMap: idVolumeLevelMap}));
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
      if (this.OurDeviceId === deviceId) {
        reject();
        return;
      }
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

  public stopSharingScreen(deviceID?: string) {
    if (deviceID) {
      this.OurDeviceId = deviceID;
    }
    const mediaParamsDeviceId = {
      audio: true,
      video: {deviceId: this.OurDeviceId}
    }
    const session = this.OurSession;
    session.getUserMedia(mediaParamsDeviceId, true)
      .then((stream: any) => {
        this.store.dispatch(updateUser({id: 77777, stream: stream}));
        this.OurSharingStatus = false;
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

      console.warn(this.OurSession);

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
