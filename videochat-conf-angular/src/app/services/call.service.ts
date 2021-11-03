import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "../reducers";
import {addUser, removeUser, updateUser} from "../reducers/participant.actions";
import {User} from "../reducers/participant.reducer";
import {resolve} from "@angular/compiler-cli/src/ngtsc/file_system";
import {mediaParams} from "./config";

declare let ConnectyCube: any;

@Injectable({
  providedIn: 'root'
})
export class CallService {
  constructor(private store: Store<State>) {
  }

  private static generateMeetRoomURL(confRoomId: string): string {
    return btoa(confRoomId);
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

  public joinUser(confRoomId: string, userId: number, userDisplayName: string) {
    return new Promise<string>((resolve, reject) => {
      const session = this.createSession();

      session.getUserMedia(mediaParams)
        .then((stream: any) => {
          this.store.dispatch(addUser({id: userId, name: userDisplayName, stream: stream}));

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
