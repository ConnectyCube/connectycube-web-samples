import {Injectable} from '@angular/core';
import {Dialog, Message} from "./config";
import {Store} from "@ngrx/store";
import {addDialog, addDialogs, addMessageId, addMessagesIdsAndParticipants} from "../reducers/dialog/dialog.actions";
import {dialogsSelector, getDialogParticipant} from "../reducers/dialog/dialog.selectors";
import {take} from 'rxjs/operators';
import {addMessage, addMessages} from "../reducers/messages/messages.action";
import {participant} from "../reducers/participants/participants.reducer";
import {builtDialog} from "./utilities";
import {addSearchParticipants} from "../reducers/participants/participants.actions";
import {Router} from "@angular/router";

declare let ConnectyCube: any;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public dialogsHeight: Map<number, number> = new Map<number, number>();
  public tempHeight: number = 0;

  constructor(
    private store$: Store,
    private router: Router) {
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

  private addDialog(dialogId: string) {
    const filters = {_id: dialogId};

    ConnectyCube.chat.dialog
      .list(filters)
      .then((result: any) => {
        const dialog: Dialog = builtDialog(result.items[0]);
        this.store$.dispatch(addDialog({dialog}));
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  public init() {
    ConnectyCube.chat.onMessageListener = (userId: any, msg: any) => {
      console.warn(userId, msg);

      this.store$.select(getDialogParticipant, {dialogId: msg.extension.dialog_id, pId: userId})
        .pipe(take(1)).subscribe(p => {
        console.warn(p)
        if (p !== undefined && !p.me) {
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
    ConnectyCube.chat.onSystemMessageListener = (msg: any) => {
      const dialogId = msg.extension.id;
      switch (msg.body) {
        case "dialog/UPDATE_DIALOG":
          this.addDialog(dialogId);
          break;
      }
    };
  }

  public getDialogs() {
    ConnectyCube.chat.dialog
      .list()
      .then((result: any) => {
        const dialogs: Array<Dialog> = result.items.map((d: any) => {
          const dialog: Dialog = builtDialog(d);
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

  public searchMethod(searchForm: any, selectedParticipant: Array<participant>) {
    if (searchForm.valid) {
      const sValue = searchForm.value.name;
      console.warn('[Search Value]', sValue);
      const promiseF = this.searchFullName(sValue);
      const promiseL = this.searchLogin(sValue);
      Promise.allSettled([promiseF, promiseL]).then((result: any) => {
        console.warn(result);
        const participants: Map<string, any> = new Map();
        result.forEach((item: any) => {
          if (item.hasOwnProperty("value")) {
            if (item.value.hasOwnProperty("items")) {
              console.log(item.value.items)
              item.value.items.forEach((item: any) => {
                participants.set(String(item.user.id), item.user)
              });
            }
            else {
              console.log(item.value);
              participants.set(String(item.value.user.id), item.value.user);
            }
          }
        })
        const participantArray: Array<participant> = [];
        [...participants].forEach(([key, value]) => {
          const active = selectedParticipant.some((p: participant) => p.id === value.id);

          if (!active) {
            participantArray.push({
              id: value.id,
              full_name: value.full_name,
              login: value.login,
              avatar: value.avatar,
              me: false,
            })
          }
        });
        console.warn(participants);
        console.warn(participantArray);
        this.store$.dispatch(addSearchParticipants({participantArray}))
      })
    }
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
        const dialog: Dialog = builtDialog(d);
        console.warn(dialog)
        idArray.forEach((ocupantId: number, index: number) => {
          if (index !== 0) {
            this.sendSystemMsg(ocupantId, dialog.id)
          }
        });
        this.store$.dispatch(addDialog({dialog}));
        this.router.navigateByUrl('chat/' + btoa(dialog.id));
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  public createIndividualChat(ocupantId: number) {
    const params = {
      type: 3,
      occupants_ids: [ocupantId],
    };

    ConnectyCube.chat.dialog
      .create(params)
      .then((d: any) => {
        const dialog: Dialog = builtDialog(d);
        console.warn(dialog)

        this.store$.select(dialogsSelector).pipe(take(1)).subscribe(res => {
          if (res !== undefined) {
            const thisIsChat = res.some((d: Dialog) => d.id === dialog.id);
            if (!thisIsChat) {
              this.sendSystemMsg(ocupantId, dialog.id)
              this.store$.dispatch(addDialog({dialog}));
            }
            this.router.navigateByUrl('chat/' + btoa(dialog.id));
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
      this.getChatParticipants(dialog.participantIds).then((result: any) => {
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
        const opponentId = dialog.participantIds.find((id: number) => !dialog.participants.get(String(id))?.me);
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

  public readAllChatMessages(dialogId: string) {
    const messageIds = "";
    const params = {
      read: 1,
      chat_dialog_id: dialogId,
    };

    ConnectyCube.chat.message
      .update(messageIds, params)
  }

  public sendSystemMsg(userId: number, dialogId: string) {
    const msg = {
      body: "dialog/UPDATE_DIALOG",
      extension: {
        id: dialogId
      }
    };

    ConnectyCube.chat.sendSystemMessage(userId, msg);
  }

}
