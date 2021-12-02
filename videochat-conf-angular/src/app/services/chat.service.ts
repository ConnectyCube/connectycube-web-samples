import {Injectable} from '@angular/core';
import {State} from "../reducers";
import {Store} from "@ngrx/store";
import {findParticipantSelector} from "../reducers/participant.selectors";
import {take} from "rxjs/operators";
import {addMessage} from "../reducers/dialog.actions";

declare let ConnectyCube: any;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private store$: Store<State>) {
  }

  public init() {
    ConnectyCube.chat.onMessageListener = (userId: any, message: any) => {
      this.store$.select(findParticipantSelector, {userId}).pipe(take(1))
        .subscribe(user => {
          if (user) {
            console.warn("[ConnectyCube.chat.onMessageListener] callback:", userId, message);
            const message_name: string = user.name;
            const message_text: string = message.body;
            const message_time = new Date(message.extension.date_sent * 1000).toLocaleTimeString().slice(0, 5);

            this.store$.dispatch(addMessage({message_name, message_text, message_time}))
          }
        })
    }
  }

  public getDialogHistory(chat_id: string) {
    const params = {
      chat_dialog_id: chat_id,
      sort_desc: "date_sent",
      limit: 100,
      skip: 0,
    };

    return ConnectyCube.chat.message.list(params);
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

}
