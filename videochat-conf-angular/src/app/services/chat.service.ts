import {Injectable} from '@angular/core';
import {State} from "../reducers";
import {Store} from "@ngrx/store";
import {findParticipantSelector} from "../reducers/participant.selectors";
import {take} from "rxjs/operators";
import {addMessage} from "../reducers/dialog.actions";
import {Message} from "../reducers/dialog.reducer";

declare let ConnectyCube: any;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private store$: Store<State>) {
  }

  private processMessages(messagesInput: any) {
    return new Promise<any>((resolve,reject)=>{
      const unFindedUsers: any = [];

      const messages = messagesInput.map((item: any) => {
        const message:any = {message_name: '', message_text: '', message_time: ''};
        // console.log("message item", item)
        message.message_text = item.message;
        message.message_time = new Date(item.date_sent * 1000).toLocaleTimeString().slice(0, 5);

        this.store$.select(findParticipantSelector, {userId: item.sender_id}).pipe(take(1))
          .subscribe(user => {
            // console.log("message user", user)
            if (user) {
              message.message_name = user.me ? '' : user.name;
            }
            else {
              if (unFindedUsers.indexOf(item.sender_id) === -1) {
                unFindedUsers.push(item.sender_id);
              }
              message.statusUndefined = true;
              message.userId = item.sender_id;
            }
          })
        return message;
      })
      console.log("messages",messages);
      console.log("unFindedUsers",unFindedUsers);

      if(unFindedUsers.length > 0){
        console.warn("[unFindedUsers.length > 0]")
        const params = {
          filter: {
            field: "id",
            param: "in",
            value: unFindedUsers,
          },
        };
        ConnectyCube.users.get(params).then((dialog:any)=>{
          dialog.items.forEach((User:any)=>{

            const fullName = User.user.full_name;
            const id = User.user.id;

            // console.warn("GO forEAch",fullName,id)

            for(let i = 0; i<messages.length;i++){
              // console.log("GO FOR",messages[i])
              if(messages[i].statusUndefined && messages[i].userId === id){

                messages[i].message_name = fullName;
                delete messages[i].statusUndefined;
                delete messages[i].userId;
              }
            }
          })
          resolve(messages.reverse());
        })
      }
      else{
        resolve(messages.reverse());
      }
    })
  }

  public init() {
    ConnectyCube.chat.onMessageListener = (userId: any, message: any) => {
      this.store$.select(findParticipantSelector, {userId}).pipe(take(1))
        .subscribe(user => {
          if (!user.me) {
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

}
