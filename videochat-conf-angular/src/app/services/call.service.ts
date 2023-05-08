import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "../reducers";
import {
  addActiveSpeaker,
  addBitrate,
  addMicrophoneLevel,
  addUser,
  removeUser,
  updateConnectionStatus, updateName,
  updateUser, updateVideoStatus
} from "../reducers/participant.actions";
import {constraints, mediaParams} from "./config";
import {User} from "../reducers/participant.reducer";
import {participantSelector} from "../reducers/participant.selectors";
import {take} from "rxjs/operators";
import {setActiveDialogId} from "../reducers/dialog.actions";
import {addRecordingStatus, addShowRecordButtonStatus} from "../reducers/interface.actions";
import {ChatService} from "./chat.service";
import {isRecordingSelector} from "../reducers/interface.selectors";
import * as ConnectyCube from "connectycube";

// declare let ConnectyCube: any;

@Injectable({
  providedIn: 'root'
})
export class CallService {
  constructor(
    private store: Store<State>,
    private chatService: ChatService,
  ) {
  }

  private UPDATE_STREAM_TIME: number = 4000;
  private MAX_VOLUME_VALUE: number = 22000;
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
  private meetId: string = '';
  private hostId: any;

  private static generateMeetRoomURL(confRoomId: string): string {
    return btoa(confRoomId);
  }

  private createDummyVideoTrack = ({width = 640, height = 480} = {}) => {
    let canvas: any = Object.assign(document.createElement("canvas"), {width, height});
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, width, height);
    setInterval(() => {
      ctx.fillRect(0, 0, width, height);
    }, 500);
    let stream = canvas.captureStream();
    console.log("[createDummyVideoTrack] tracks", stream.getTracks());
    const videoTrack = Object.assign(stream.getVideoTracks()[0], {enabled: true});
    console.log("[createDummyVideoTrack] videoTrack", videoTrack);
    return videoTrack;
  }

  private getByValue(map: Map<number, number>, searchValue: number) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue) {
        return key;
      }
    }
    return -1;
  }

  public init() {
    ConnectyCube.videochatconference.onParticipantJoinedListener = (
      session: any,
      userId: number,
      userDisplayName: string,
      isExistingParticipant: any
    ) => {
      this.store.select(participantSelector).pipe(take(1)).subscribe(res => {
        if (res.some((user: User) => user.id === userId)) {
          this.store.dispatch(updateName({id: userId, name: userDisplayName}))
        }
        else {
          this.store.dispatch(addUser({
            id: userId,
            name: userDisplayName,
            volumeLevel: 0,
            bitrate: '',
            connectionStatus: 'good',
            videoStatus: false
          }));
        }
      })

      console.warn("[onParticipantJoinedListener]")

      this.store.select(isRecordingSelector).pipe(take(1)).subscribe(res => {
        if (res !== undefined) {
          if (res) {
            this.chatService.sendSystemMsg("dialog/START_RECORD", userId);
          }
          else {
            this.chatService.sendSystemMsg("dialog/STOP_RECORD", userId);
          }
        }
      })

      this.store.select(participantSelector).pipe(take(1)).subscribe(res => {
        const userMe: any = res.find((user: User) => user.me === true);
        if (userMe.videoStatus === 'share') {
          this.chatService.sendSystemMsg("SHARE_ON", userId);
        }
        else if (userMe.videoStatus === true) {
          this.chatService.sendSystemMsg("VIDEO_ON", userId);
        }
        else {
          this.chatService.sendSystemMsg("VIDEO_OFF", userId);
        }
      })


      if (this.subscribeParticipantArray) {
        this.stopCheckUserMicLevel();
      }

      this.startCheckUsersMicLevel();

    };
    ConnectyCube.videochatconference.onParticipantLeftListener
      = (session: any, userId: number) => {
      this.store.dispatch(removeUser({id: Number(userId)}));
      this.stopCheckUserMicLevel();

      this.participantArray$.pipe(take(1)).subscribe(res => {
        this.participantArray = res;
        console.warn("[PARTICIPANT ARRAY AFTER REMOVE]", this.participantArray);
      });

      if (this.participantArray.length < 2) {
        this.currentMode = 'grid';
      }
      else {
        this.startCheckUsersMicLevel();
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

  public updateUserVideoStatus(id: number, status: boolean) {
    this.store.dispatch(updateVideoStatus({id: id, videoStatus: status}));
  }

  public setCurrentMode(mode: string) {
    this.currentMode = mode;
  }

  public getParticipantArrayLength() {
    return this.participantArray?.length;
  }

  public startCheckUsersMicLevel() {
    console.log("[StartCheckUsersMic]");
    this.OurIntervalId = setInterval(this.getUsersMicLevel.bind(this), this.UPDATE_STREAM_TIME);
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

  public getUsersMicLevel() {
    const session = this.OurSession;
    //Get listener to Participants array and get participantArray if change
    this.subscribeParticipantArray = this.participantArray$.pipe(take(1)).subscribe(res => {
      this.participantArray = res;
    });

    console.warn("[PARTICIPANT ARRAY]", this.participantArray);

    this.getUsersBitrate(session);

    console.log("[getUsersMicLevel 4s]");
    const idVolumeLevelMap: Map<number, number> = new Map;
    this.participantArray.forEach((user: User) => {
      if (user.volumeLevel !== undefined) {
        let level = Math.trunc((Number(session.getRemoteUserVolume(user.id)) / this.MAX_VOLUME_VALUE) * 100);
        if (level < 6) {
          level = 0;
        }
        idVolumeLevelMap.set(user.id, level);
      }
    })

    let maxVolume = Math.max(...idVolumeLevelMap.values());
    if (maxVolume !== 0) {
      this.store.dispatch(addActiveSpeaker({id: this.getByValue(idVolumeLevelMap, maxVolume)}));
    }

    this.store.dispatch(addMicrophoneLevel({idVolumeLevelMap: idVolumeLevelMap}));
  }

  public SetOurDeviceId(id: any) {
    this.OurDeviceId = id;
  }

  public muteOrUnmuteMicro() {
    return new Promise<string>((resolve, reject) => {
      try {
        const session = this.OurSession;
        if (session.isAudioMuted()) {
          session.unmuteAudio();
          resolve("mic");
        }
        else {
          session.muteAudio();
          resolve("mic_off");
        }
      }
      catch (error: any) {
        console.log("MuteOrUnmuteMicro Error!", error);
        reject();
      }
    })
  }


  public muteOrUnmuteVideo(videoWork: boolean) {
    return new Promise<boolean>((resolve, reject) => {
      try {
        const mediaParamsDeviceId = {
          audio: true,
          video: {deviceId: this.OurDeviceId}
        }

        const session = this.OurSession;

        console.log("Video work status", videoWork)

        if (!videoWork) {
          console.warn("IF St", session.localStream.getVideoTracks())
          session.getUserMedia(mediaParamsDeviceId, true)
            .then((stream: any) => {
              this.store.dispatch(updateVideoStatus({id: 77777, videoStatus: true}));
              resolve(false);
              this.store.select(participantSelector).pipe(take(1)).subscribe(res => {
                res.forEach((user: User) => {
                  if (!user.me) {
                    this.chatService.sendSystemMsg("VIDEO_ON", user.id);
                  }
                })
              })
            })
        }
        else {
          this.store.dispatch(updateVideoStatus({id: 77777, videoStatus: false}));
          console.warn("ELSE St", session.localStream.getVideoTracks())
          session.getUserMedia({audio: true}, true)
            .then((stream: any) => {
              stream.addTrack(this.createDummyVideoTrack());
              resolve(false);
              this.store.select(participantSelector).pipe(take(1)).subscribe(res => {
                res.forEach((user: User) => {
                  if (!user.me) {
                    this.chatService.sendSystemMsg("VIDEO_OFF", user.id);
                  }
                })
              })
            })
        }

        console.log("LOCAL STREAM", session.localStream.getVideoTracks());
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
    console.log();
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
          this.store.select(participantSelector).pipe(take(1)).subscribe(res => {
            res.forEach((user: User) => {
              if (!user.me) {
                this.chatService.sendSystemMsg("VIDEO_ON", user.id);
              }
            })
          })
        })
        .catch((error: any) => {
          console.log("Switch camera Error!", error);
        });
    })
  }

  public stopSharingScreen(deviceID?: string, videoPermission?: boolean) {
    if (deviceID) {
      this.OurDeviceId = deviceID;
    }
    const mediaParamsDeviceId = {
      audio: true,
      video: {deviceId: this.OurDeviceId}
    }
    const session = this.OurSession;
    if (videoPermission === false) {
      console.log("STOP SHARE CATCH IF")
      session.getUserMedia({audio: true}, true).then((stream: any) => {
        stream.addTrack(this.createDummyVideoTrack());
      });

      this.OurSharingStatus = false;
      return;
    }
    session.getUserMedia(mediaParamsDeviceId, true)
      .then((stream: any) => {
        console.log("STOP SHARE GET USER MEDIA")
        this.store.dispatch(updateUser({id: 77777, stream: stream}));

        this.OurSharingStatus = false;
      })
      .catch(() => {
        console.log("STOP SHARE CATCH GET USER MEDIA", videoPermission)
      })
  }

  public shareScreen() {
    return new Promise<any>((resolve, reject) => {
      const shareStatus = this.OurSharingStatus;
      if (shareStatus) {
        console.log("REJECT")
        reject();
      }
      else {
        const session = this.OurSession;
        session
          .getDisplayMedia(constraints, true)
          .then((localDesktopStream: any) => {
            console.warn("ShareSTREAM", localDesktopStream)
            localDesktopStream.getTracks().forEach((tr: any) => {
              console.log(tr);
            })
            this.store.dispatch(updateUser({id: 77777, stream: localDesktopStream}));

            this.store.select(participantSelector).pipe(take(1)).subscribe(res => {
              res.forEach((user: User) => {
                if (!user.me) {
                  this.chatService.sendSystemMsg("SHARE_ON", user.id);
                }
              })
            })

            this.OurSharingStatus = true;
            resolve(localDesktopStream);
          })
          .catch((error: any) => {
            console.log('Share Permission error', error)
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
            this.store.dispatch(addUser({
              me: true,
              id: userId,
              name: userDisplayName,
              stream: stream,
              videoStatus: false
            }));
          }
          else {
            this.store.dispatch(addUser({
              me: true,
              id: userId,
              name: userDisplayName,
              stream: stream,
              videoStatus: true
            }));
          }

          ConnectyCube.meeting.get({_id: confRoomId})
            .then((meeting: any) => {
              this.meetId = meeting._id;
              this.hostId = meeting.host_id;
              if (userId === meeting.host_id) {
                this.store.dispatch(addShowRecordButtonStatus({showRecordButtonStatus: true}));
              }
              else {
                this.store.dispatch(addShowRecordButtonStatus({showRecordButtonStatus: false}));
              }
              session.join(confRoomId, userId, userDisplayName).then((res: any) => {
                console.warn(res)
              }).catch((error: any) => {
                console.error(error)
              })


            })

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
        chat: true,
        public: true
      };


      ConnectyCube.meeting.create(params)
        .then((meeting: any) => {
          console.warn(meeting);
          const chatId = meeting.chat_dialog_id;
          console.warn(chatId);
          this.store.dispatch(setActiveDialogId({dialogId: chatId}));
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

  public recordingStart() {
    if (this.meetId) {
      return ConnectyCube.meeting
        .update(this.meetId, {record: true})
        .then((meeting: any) => {
          this.store.dispatch(addRecordingStatus({isRecording: true}));
          this.store.select(participantSelector).pipe(take(1)).subscribe(participantArr => {
            participantArr.forEach((user: User) => {
              if (user.id !== this.hostId) {
                this.chatService.sendSystemMsg("dialog/START_RECORD", user.id);
              }
            })
          })
        })
        .catch((error: any) => {
          console.error("Recording Start", error);
        });
    }
  }

  public recordingStop() {
    if (this.meetId) {
      return ConnectyCube.meeting
        .update(this.meetId, {record: false})
        .then((meeting: any) => {
          this.store.dispatch(addRecordingStatus({isRecording: false}));
          this.store.select(participantSelector).pipe(take(1)).subscribe(participantArr => {
            participantArr.forEach((user: User) => {
              if (user.id !== this.hostId) {
                this.chatService.sendSystemMsg("dialog/STOP_RECORD", user.id);
              }
            })
          })
        })
        .catch((error: any) => {
          console.error("Recording Stop", error);
        });
    }
  }

}
