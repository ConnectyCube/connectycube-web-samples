import {Injectable} from '@angular/core';
import {Dialog, Message} from "./config";
import {Store} from "@ngrx/store";
import {addDialog, addDialogs, addMessageId, addMessagesIdsAndParticipants} from "../reducers/dialog/dialog.actions";
import {dialogsSelector, getDialogParticipant} from "../reducers/dialog/dialog.selectors";
import {take} from 'rxjs/operators';
import {addMessage, addMessages} from "../reducers/messages/messages.action";
import {participant} from "../reducers/participants/participants.reducer";

declare let ConnectyCube: any;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public dialogsHeight: Map<number, number> = new Map<number, number>();
  public tempHeight: number = 0;

  constructor(private store$: Store) {
  }

  private getChatParticipants(pId: Array<number>) {
    const params = {
      filter: {
        field: "id",
        param: "in",
        value: pId,
      },
    };

    return ConnectyCube.users.get(params)
  }

  private processParticipants(users: any): Map<string, participant> {
    const participants: Map<string, participant> = new Map<string, participant>();
    const loginMe = atob(<string>localStorage.getItem("login"));
    users.forEach((u: any) => {
      const p: participant = {
        id: u.user.id,
        full_name: u.user.full_name,
        login: u.user.login,
        avatar: u.user.avatar,
        me: loginMe === u.user.login
      }
      participants.set(String(p.id), p);
    })
    return participants;
  }

  public init() {
    ConnectyCube.chat.onMessageListener = (userId: any, msg: any) => {
      console.warn(userId, msg);

      this.store$.select(getDialogParticipant, {dialogId: msg.extension.dialog_id, pId: userId})
        .pipe(take(1)).subscribe(p => {
        console.warn(p)
        if (p !== undefined) {
          const message: Message = {
            id: msg.id,
            body: msg.body,
            senderName: p.full_name,
            date_sent: msg.extension.date_sent
          }

          this.store$.dispatch(addMessageId({dialogId: msg.extension.dialog_id, msgIds: [msg.id]}));
          this.store$.dispatch(addMessage({message}));
        }
      });
    }
  }

  public getDialogs() {
    ConnectyCube.chat.dialog
      .list()
      .then((result: any) => {
        const dialogs: Array<Dialog> = result.items.map((d: any) => {
          const dialog: Dialog = {
            id: d._id, name: d.name, type: d.type, photo: d.photo, lastMessage: d.last_message,
            lastMessageDate: d.last_message_date_sent, unreadMessage: d.unread_messages_count,
            createAt: d.created_at, msgIds: [], pId: d.occupants_ids, participants: new Map<string, participant>()
          };
          return dialog;
        })
        console.warn("[Processed dialogs]", dialogs);
        this.store$.dispatch(addDialogs({dialogs}));
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  public searchFullName(fullName: string) {
    const searchParams = {full_name: fullName};

    return ConnectyCube.users
      .get(searchParams)
  }

  public searchLogin(login: string) {
    const searchParams = {login: login};
    return ConnectyCube.users
      .get(searchParams)
  }

  public createGroupChat(name: string, description: string, idArray: Array<number>, photo?: string) {
    const params = {
      type: 2,
      name: name,
      occupants_ids: idArray,
      description: description,
      photo: photo,
    };

    ConnectyCube.chat.dialog
      .create(params)
      .then((d: any) => {
        console.warn(d);
        const dialog: Dialog = {
          id: d._id, name: d.name, type: d.type, photo: d.photo, lastMessage: d.last_message,
          lastMessageDate: d.last_message_date_sent, unreadMessage: d.unread_messages_count,
          createAt: d.created_at, msgIds: [], pId: d.occupants_ids, participants: new Map<string, participant>()
        };
        console.warn(dialog)
        this.store$.dispatch(addDialog({dialog}));
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  public createIndividualChat(id: number) {
    const params = {
      type: 3,
      occupants_ids: [id],
    };

    ConnectyCube.chat.dialog
      .create(params)
      .then((d: any) => {
        const dialog: Dialog = {
          id: d._id, name: d.name, type: d.type, photo: d.photo, lastMessage: d.last_message,
          lastMessageDate: d.last_message_date_sent, unreadMessage: d.unread_messages_count,
          createAt: d.created_at, msgIds: [], pId: d.occupants_ids, participants: new Map<string, participant>()
        };
        console.warn(dialog)
        this.store$.select(dialogsSelector).pipe(take(1)).subscribe(res => {
          if (res !== undefined) {
            const thisIsChat = res.some((d: Dialog) => d.id === dialog.id);
            if (!thisIsChat) {
              this.store$.dispatch(addDialog({dialog}));
            }
          }
        })
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  public getChatHistory(dialog: Dialog, isActivated: boolean) {
    const dialogId = dialog.id;
    const params = {
      chat_dialog_id: dialogId,
      sort_desc: "date_sent",
      limit: 100,
      skip: 0,
    };

    if (!isActivated) {
      this.getChatParticipants(dialog.pId).then((result: any) => {
        console.warn("[RESULT]", result)
        const participants: Map<string, participant> = this.processParticipants(result.items)
        console.warn("[PROCECED USER]", participants);
        ConnectyCube.chat.message
          .list(params)
          .then((result: any) => {
            const msgs = result.items;
            console.warn(msgs)
            const messages: Array<Message> = [];
            const msgIds: Array<string> = [];
            msgs.forEach((m: any) => {
              const sender = participants.get(String(m.sender_id));
              const message: Message = {
                id: m._id,
                body: m.message,
                date_sent: m.date_sent,
                senderName: sender?.me ? "" : sender?.full_name,
              }
              messages.push(message);
              msgIds.push(m._id);
            })
            console.warn("[MESSAGES]", messages);
            console.warn("[IDS]", msgIds);

            this.store$.dispatch(addMessages({messages}))
            this.store$.dispatch(addMessagesIdsAndParticipants({dialogId, msgIds, participants}))
          })
          .catch((error: any) => {
            console.error(error);
          });
      })
        .catch((error: any) => {
          console.error(error);
        })
    }
  }

  public sendMessage(dialog: Dialog, message: Message) {
    return new Promise<void>((resolve, reject) => {
      const messageParams: any = {
        type: dialog.type === 3 ? 'chat' : 'groupchat',
        body: message.body,
        extension: {
          save_to_history: 1,
          dialog_id: dialog.id
        },
        markable: 1
      };

      if (dialog.type === 3) {
        let opponentId;
        dialog.pId.forEach((id: number) => {
          const p = dialog.participants.get(String(id));
          if (!p?.me) {
            opponentId = +id;
          }
        })
        message.id = ConnectyCube.chat.send(opponentId, messageParams);
      }
      else {
        message.id = ConnectyCube.chat.send(dialog.id, messageParams);
      }
      this.store$.dispatch(addMessageId({dialogId: dialog.id, msgIds: [message.id]}));
      this.store$.dispatch(addMessage({message}));
      resolve();
    })
  }

}
