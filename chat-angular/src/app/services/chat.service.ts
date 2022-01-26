import {Injectable} from '@angular/core';
import {Dialog, Message} from "./config";
import {Store} from "@ngrx/store";
import {
  addDialog,
  addDialogs,
  addMessageId,
  addMessagesIdsAndParticipants,
  addTypingParticipant,
  addOneUnreadMessage,
  removeTypingParticipant,
  updateDialogLastMessage,
  updateDialogParticipants,
  readDialogAllMessages, updateParticipantLastActivity
} from "../reducers/dialog/dialog.actions";
import {
  dialogsSelector, getDialogParticipant,
  getIndividualDialogByParticipantId, selectedConversationSelector
} from "../reducers/dialog/dialog.selectors";
import {filter, take} from 'rxjs/operators';
import {addMessage, addMessages, updateMessageStatus} from "../reducers/messages/messages.action";
import {participant} from "../reducers/participants/participants.reducer";
import {builtDialog} from "./utilities";
import {addParticipants, addSearchParticipants} from "../reducers/participants/participants.actions";
import {Router} from "@angular/router";
import {meSelector} from "../reducers/participants/participants.selectors";
import {getUnreadMessageList} from "../reducers/messages/messages.selectors";

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

  private prepareMessageWithAttachmentAndSend(file: any, dialog: Dialog, senderId: number) {
    const messageParams = {
      type: dialog.type === 3 ? "chat" : "groupchat",
      body: "attachment",
      extension: {
        save_to_history: 1,
        dialog_id: dialog.id,
        attachments: [{uid: file.uid, id: file.id, type: "photo"}],
      },
    };

    const message: Message = {
      id: "",
      body: "",
      senderId: senderId,
      senderName: "",
      status: "pending",
      date_sent: Math.floor(Date.now() / 1000)
    }

    if (dialog.type === 3) {
      const opponentId = dialog.participantIds.find((id: number) => !dialog.participants.get(String(id))?.me);
      message.id = ConnectyCube.chat.send(opponentId, messageParams);
    }
    else {
      message.id = ConnectyCube.chat.send(dialog.id, messageParams);
    }

    if (message.id) {
      message.photo = ConnectyCube.storage.privateUrl(file.uid);
      console.warn(message);
      if (message.photo) {
        this.store$.dispatch(addMessageId({dialogId: dialog.id, msgIds: [message.id]}));
        this.store$.dispatch(addMessage({message}));
      }
    }
  }

  public init() {
    ConnectyCube.chat.onMessageListener = (userId: any, msg: any) => {
      console.warn(userId, msg);

      this.store$.dispatch(updateDialogLastMessage({
        dialogId: msg.extension.dialog_id,
        lastMessage: msg.body,
        lastMessageDate: msg.extension.date_sent
      }))

      this.store$.select(meSelector).pipe(take(1)).subscribe(userMe => {
        if (userMe) {
          if (userMe.id !== userId) {
            this.store$.select(selectedConversationSelector).pipe(take(1))
              .subscribe(selectedConversation => {
                if (selectedConversation === msg.extension.dialog_id) {
                  this.readOneMessage(msg.id, msg.extension.dialog_id);
                  this.sendReadStatus(msg.id, userId, msg.extension.dialog_id);
                }
              })
            this.store$.dispatch(addOneUnreadMessage({
              dialogId: msg.extension.dialog_id
            }));
          }
        }
      })

      this.store$.select(getDialogParticipant, {dialogId: msg.extension.dialog_id, pId: userId})
        .pipe(take(1)).subscribe(p => {
        console.warn(p)
        if (p !== undefined && !p.me) {
          const message: Message = {
            id: msg.id,
            body: msg.body,
            senderId: p.id,
            senderName: p.full_name,
            status: "read",
            date_sent: msg.extension.date_sent
          }
          if (msg.extension.hasOwnProperty("attachments") && msg.extension.attachments.length > 0) {
            const fileUID = msg.extension.attachments[0].uid;
            message.photo = ConnectyCube.storage.privateUrl(fileUID);
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

    ConnectyCube.chat.onMessageTypingListener = (isTyping: boolean, userId: number, dialogId: string) => {
      //Group dialog
      if (dialogId) {
        this.store$.select(meSelector).pipe(take(1)).subscribe(userMe => {
          if (userMe !== undefined) {
            if (userMe.id !== userId) {
              console.log("GROUP CHAT", isTyping, userId, dialogId);
              if (isTyping) {
                this.store$.dispatch(addTypingParticipant({dialogId, pId: userId}));
              }
              else {
                this.store$.dispatch(removeTypingParticipant({dialogId, pId: userId}));
              }
            }
          }
        })
      }
      //Individual dialog
      else {
        this.store$.select(getIndividualDialogByParticipantId, {pId: userId}).pipe(take(1))
          .subscribe((dialogId: any) => {
            if (dialogId !== undefined) {
              console.log("INDIVIDUAL CHAT", isTyping, userId, dialogId);
              if (isTyping) {
                this.store$.dispatch(addTypingParticipant({dialogId, pId: userId}));
              }
              else {
                this.store$.dispatch(removeTypingParticipant({dialogId, pId: userId}));
              }
            }
          })
      }
    };
    ConnectyCube.chat.onSentMessageCallback = (messageLost: any, messageSent: any) => {
      console.warn("[onSentMessageCallback]", messageLost, messageSent);
      if (messageSent) {
        this.store$.dispatch(updateMessageStatus({msgId: messageSent.id, status: "sent"}));
      }
      else {
        this.store$.dispatch(updateMessageStatus({msgId: messageSent.id, status: "error"}));
      }
    };
    ConnectyCube.chat.onReadStatusListener = (messageId: string, dialogId: string, userId: number) => {
      console.log("[ConnectyCube.chat.onReadStatusListener] callback:", messageId, dialogId, userId);
      this.store$.select(selectedConversationSelector).pipe(filter(v => !!v), take(1))
        .subscribe(selectedConversation => {
          if (selectedConversation === dialogId) {
            this.store$.dispatch(updateMessageStatus({msgId: messageId, status: "read"}));
          }
        })
    };
    ConnectyCube.chat.onLastUserActivityListener = (userId: number, seconds: number) => {
      console.warn("[onLastUserActivityListener]", userId, seconds)
      this.store$.dispatch(updateParticipantLastActivity({participantId: userId, lastActivity: seconds}));
    };
  }

  public getDialogs() {
    ConnectyCube.chat.dialog
      .list()
      .then((result: any) => {
        const lastMessageUserIds: Array<number> = []
        const dialogs: Array<Dialog> = result.items.map((d: any) => {
          if (d.type === 3) {
            lastMessageUserIds.push(d.last_message_user_id);
          }
          return builtDialog(d);
        })
        console.warn("[lastMessageUserIds]", lastMessageUserIds)
        this.searchUsersById(lastMessageUserIds).then((result: any) => {
          console.warn("[searchUsersById]", result);
          const participants: Array<participant> = result.items.map((u: any) => {
            return {
              id: u.user.id,
              full_name: u.user.full_name,
              login: u.user.login,
              avatar: u.user.avatar,
              me: u.user.login === atob(<string>localStorage.getItem('login')),
            }
          })
          this.store$.dispatch(addParticipants({participants}));
          console.warn("[Processed dialogs]", dialogs);
          this.store$.dispatch(addDialogs({dialogs}));
        })
          .catch((error: any) => {
            console.error(error);
          })
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  public sendMsgWithPhoto(file: any, dialog: Dialog, senderId: number) {
    const fileParams = {
      name: file.name,
      file: file,
      type: file.type,
      size: file.size,
      public: false,
    };

    ConnectyCube.storage
      .createAndUpload(fileParams)
      .then((result: any) => {
        console.warn(result);
        this.prepareMessageWithAttachmentAndSend(result, dialog, senderId);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  public searchUsersByFullName(fullName: string) {
    const searchParams = {full_name: fullName};

    return ConnectyCube.users
      .get(searchParams)
  }

  public searchUsersById(userIds: Array<number>) {
    const params = {
      page: 1,
      filter: {
        field: "id",
        param: "in",
        value: userIds,
      },
    };

    return ConnectyCube.users
      .get(params)
  }

  public searchUsersByLogin(login: string) {
    const searchParams = {login: login};
    return ConnectyCube.users
      .get(searchParams)
  }

  public searchMethod(searchForm: any, selectedParticipant: Array<participant>) {
    if (searchForm.valid) {
      const sValue = searchForm.value.name;
      console.warn('[Search Value]', sValue);
      const promiseF = this.searchUsersByFullName(sValue);
      const promiseL = this.searchUsersByLogin(sValue);
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

    this.store$.dispatch(readDialogAllMessages({dialogId}));

    if (!isActivated) {
      this.getChatParticipants(dialog.participantIds).then((result: any) => {
        console.warn("[RESULT]", result)
        const participants: Map<string, participant> = this.processParticipants(result.items)
        this.store$.dispatch(updateDialogParticipants({dialogId, participants}));
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
                status: m.read ? "read" : "sent",
                date_sent: m.date_sent,
                senderName: sender?.me ? "" : sender?.full_name,
                senderId: m.sender_id
              }

              if (!m.read && !sender?.me) {
                this.sendReadStatus(m._id, m.sender_id, dialogId);
              }

              if (m.hasOwnProperty("attachments") && m.attachments.length > 0) {
                const fileUID = m.attachments[0].uid;
                message.photo = ConnectyCube.storage.privateUrl(fileUID);
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
          console.warn(111111111111)
          console.error(error);
        })
    }
    else {
      this.readAllChatMessages(dialogId);
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
        console.warn(dialog.participants);
        const opponentId = dialog.participantIds.find((id: number) => !dialog.participants.get(String(id))!.me);
        console.warn(opponentId);
        this.store$.dispatch(updateDialogLastMessage({
          dialogId: dialog.id,
          lastMessage: message.body,
          lastMessageDate: message.date_sent
        }))
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

  public sendSystemMsg(userId: number, dialogId: string) {
    const msg = {
      body: "dialog/UPDATE_DIALOG",
      extension: {
        id: dialogId
      }
    };

    ConnectyCube.chat.sendSystemMessage(userId, msg);
  }

  public sendStartTypingStatus(dialog: Dialog) {
    console.log("[START] 111111")
    //Group dialog
    if (dialog.type === 2) {
      ConnectyCube.chat.sendIsTypingStatus(dialog.id);
    }
    else {
      const opponentId = dialog.participantIds.find((id: number) => !dialog.participants.get(String(id))?.me);
      ConnectyCube.chat.sendIsTypingStatus(opponentId, dialog.id);
    }
  }

  public sendStopTypingStatus(dialog: Dialog) {
    //Group dialog
    if (dialog.type === 2) {
      ConnectyCube.chat.sendIsStopTypingStatus(dialog.id);
    }
    else {
      const opponentId = dialog.participantIds.find((id: number) => !dialog.participants.get(String(id))?.me);
      ConnectyCube.chat.sendIsStopTypingStatus(opponentId);
    }
  }

  public readAllChatMessages(dialogId: string) {
    const messageIds = "";
    const params = {
      read: 1,
      chat_dialog_id: dialogId,
    };

    this.store$.select(getUnreadMessageList(dialogId)).pipe(filter(v => !!v), take(1))
      .subscribe(unreadMessageList => {
        if (unreadMessageList.length !== 0) {
          unreadMessageList.forEach((msg: Message) => {
            this.sendReadStatus(msg.id, msg.senderId, dialogId)
          });
        }
      })

    ConnectyCube.chat.message
      .update(messageIds, params)
  }

  public readOneMessage(messageId: string, dialogId: string) {
    const params = {
      read: 1,
      chat_dialog_id: dialogId,
    };
    ConnectyCube.chat.message
      .update(messageId, params)
  }

  public sendReadStatus(messageId: string, userId: number, dialogId: string) {
    if (userId) {
      console.warn(userId, '[IDDDD]')
      ConnectyCube.chat.sendReadStatus({messageId, userId, dialogId});
    }
  }

  public getLastActivity(userId: number) {
    if (ConnectyCube.chat.isConnected) {
      return ConnectyCube.chat
        .getLastUserActivity(userId)
    }
  }

  public subscribeToUserLastActivity(userId: number) {
    if (ConnectyCube.chat.isConnected) {
      ConnectyCube.chat.subscribeToUserLastActivityStatus(userId);
    }
  }

  public unsubscribeFromUserLastActivity(userId: number) {
    if (ConnectyCube.chat.isConnected) {
      ConnectyCube.chat.unsubscribeFromUserLastActivityStatus(userId);
    }
  }

}
