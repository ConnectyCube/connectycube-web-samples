import {Injectable, SecurityContext} from '@angular/core';
import {State} from "../reducers";
import {Store} from "@ngrx/store";
import {findParticipantSelector, participantSelector} from "../reducers/participant.selectors";
import {take} from "rxjs/operators";
import {addMessage} from "../reducers/dialog.actions";
import {addRecordingStatus} from "../reducers/interface.actions";
import {addUser, updateVideoStatus} from "../reducers/participant.actions";
import {User} from "../reducers/participant.reducer";
import ConnectyCube from "connectycube";
import {CommonUtilities} from "../utilities/common.utilities";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private store$: Store<State>,
              private sanitizer: DomSanitizer) {
  }

  private processMessages(messagesInput: any) {
    return new Promise<any>((resolve, reject) => {
      const unFindedUsers: any = [];

      const messages = messagesInput.map((item: any) => {
        const message: any = {senderName: '', body: '', time: ''};
        // console.log("message item", item)
        message.body = this.sanitizer.sanitize(SecurityContext.HTML, CommonUtilities.escapeHTMLString(item.message));
        message.time = new Date(item.date_sent * 1000).toLocaleDateString() + ' ' + new Date(item.date_sent * 1000).toLocaleTimeString().slice(0, 5);

        this.store$.select(findParticipantSelector, {userId: item.sender_id}).pipe(take(1))
          .subscribe(user => {
            // console.log("message user", user)
            if (user) {
              message.senderName = user.me ? '' : user.name;
            }
            else {
              if (unFindedUsers.indexOf(item.sender_id) === -1) {
                unFindedUsers.push(item.sender_id);
              }
              message.IsUndefinedUserDetails = true;
              message.userId = item.sender_id;
            }
          })
        return message;
      })
      console.log("messages", messages);
      console.log("unFindedUsers", unFindedUsers);

      if (unFindedUsers.length > 0) {
        console.warn("[unFindedUsers.length > 0]")
        const params = {
          filter: {
            field: "id",
            param: "in",
            value: unFindedUsers,
          },
        };
        ConnectyCube.users.get(params).then((dialog: any) => {
          dialog.items.forEach((User: any) => {

            const fullName = User.user.full_name;
            const id = User.user.id;

            // console.warn("GO forEAch",fullName,id)

            for (let i = 0; i < messages.length; i++) {
              // console.log("GO FOR",messages[i])
              if (messages[i].IsUndefinedUserDetails && messages[i].userId === id) {

                messages[i].senderName = fullName;
                delete messages[i].IsUndefinedUserDetails;
                delete messages[i].userId;
              }
            }
          })
          resolve(messages.reverse());
        })
      }
      else {
        resolve(messages.reverse());
      }
    })
  }

  public init() {
    ConnectyCube.chat.onMessageListener = (userId: any, message: any) => {
      this.store$.select(findParticipantSelector, {userId}).pipe(take(1))
        .subscribe(user => {
          if (!user.me) {
            const sound = new Audio("../../assets/sounds/notification.mp3");
            sound.play();
            console.warn("[ConnectyCube.chat.onMessageListener] callback:", userId, message);
            const senderName: string = user.name;
            const body: string = CommonUtilities.escapeHTMLString(message.body);
            const time = new Date(message.extension.date_sent * 1000).toLocaleDateString() + ' ' +
              new Date(message.extension.date_sent * 1000).toLocaleTimeString().slice(0, 5);

            this.store$.dispatch(addMessage({
              senderName,
              body: this.sanitizer.sanitize(SecurityContext.HTML, CommonUtilities.escapeHTMLString(body)),
              time: time
            }))
          }
        })
    }
    ConnectyCube.chat.onSystemMessageListener = (msg: any) => {
      const command = msg.body;
      console.warn("[Command]", command);
      switch (command) {
        case "dialog/START_RECORD":
          this.store$.dispatch(addRecordingStatus({isRecording: true}));
          break;
        case "dialog/STOP_RECORD":
          this.store$.dispatch(addRecordingStatus({isRecording: false}));
          break;
        case "VIDEO_ON":
          console.warn("CASE ON")
          this.store$.select(participantSelector).pipe(take(1)).subscribe(res => {
            if (res.some((user: User) => user.id === msg.userId)) {
              this.store$.dispatch(updateVideoStatus({id: msg.userId, videoStatus: true}))
            }
            else {
              this.store$.dispatch(addUser({
                id: msg.userId,
                volumeLevel: 0,
                bitrate: '',
                connectionStatus: 'good',
                videoStatus: true
              }));
            }
          })
          break;
        case "VIDEO_OFF":
          console.warn("CASE OFF")
          this.store$.select(participantSelector).pipe(take(1)).subscribe(res => {
            if (res.some((user: User) => user.id === msg.userId)) {
              this.store$.dispatch(updateVideoStatus({id: msg.userId, videoStatus: false}));
            }
            else {
              this.store$.dispatch(addUser({
                id: msg.userId,
                volumeLevel: 0,
                bitrate: '',
                connectionStatus: 'good',
                videoStatus: false
              }));
            }
          })
          break;
        case "SHARE_ON":
          this.store$.dispatch(updateVideoStatus({id: msg.userId, videoStatus: 'share'}));
          break;
        case "SHARE_OFF":
          this.store$.dispatch(updateVideoStatus({id: msg.userId, videoStatus: true}));
          break;
      }
    };
  }

  public getDialogHistory(chat_id: string) {
    const params = {
      chat_dialog_id: chat_id,
      sort_desc: "date_sent",
      limit: 100,
      skip: 0,
    };

    return ConnectyCube.chat.message.list(params).then((dialog: any) => {
      console.table("History", dialog.items);
      return this.processMessages(dialog.items)
    });
  }

  public subscribeToDialog(meetingId: string) {
    return new Promise<any>((resolve, reject) => {
      ConnectyCube.meeting.get({_id: meetingId})
        .then((meeting: any) => {
          ConnectyCube.chat.dialog.subscribe(meeting.chat_dialog_id)
            .then((dialog: any) => {
              resolve(dialog);
            })
            .catch((error: any) => {
              console.error("subscribe To Dialog", error);
            })
        })
        .catch((error: any) => {
          console.error("getMeeting", error);
        })
    })
  }

  public sendMessage(messageText: string, dialogId: string) {
    const message = {
      type: "groupchat",
      body: messageText,
      extension: {
        save_to_history: 1,
      },
    };
    ConnectyCube.chat.send(dialogId, message);
  }

  public sendSystemMsg(command: string, userId: number) {
    const msg = {
      body: command,
      extension: {},
    };
    ConnectyCube.chat.sendSystemMessage(userId, msg);
  }

}
