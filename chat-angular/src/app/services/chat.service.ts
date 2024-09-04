import {Injectable} from '@angular/core';
import {Dialog, Message, pathToLoader} from "./config";
import {Store} from "@ngrx/store";
import {
  addDialog,
  addDialogs,
  addMessageId,
  addMessagesIds,
  addTypingParticipant,
  addOneUnreadMessage,
  removeTypingParticipant,
  updateDialogLastMessage,
  readDialogAllMessages,
  updateMessageId,
  updateDialogParticipant,
  addDialogParticipants,
  updateDialogParticipants,
  removeDialog, setNullConverastion
} from "../reducers/dialog/dialog.actions";
import {
  dialogsSelector,
  getIndividualDialogByParticipantId, selectedConversationSelector
} from "../reducers/dialog/dialog.selectors";
import {filter, take} from 'rxjs/operators';
import {
  addMessage,
  addMessages,
  updateMessagePhoto,
  updateMessageSendersName, updateMessagesStatus,
  updateMessageStatus
} from "../reducers/messages/messages.action";
import {participant} from "../reducers/participants/participants.reducer";
import {builtDialog, makeid} from "./utilities";
import {
  addParticipants,
  addSearchParticipants,
  updateParticipantLastActivity
} from "../reducers/participants/participants.actions";
import {Router} from "@angular/router";
import {getParticipant, meSelector} from "../reducers/participants/participants.selectors";
import {
  getMessagesSelector,
  getUnreadMessageListByBadge,
  getUnreadMessageListByStatus
} from "../reducers/messages/messages.selectors";
import ConnectyCube from "connectycube";
import {MeasureService} from "./measure.service";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public dialogsHeight: Map<number, number> = new Map<number, number>();
  public tempHeight: number = 0;

  constructor(
    private store$: Store,
    private router: Router,
    private measureService: MeasureService
  ) {
  }

  private getChatParticipants(participantsIds: Array<number>) {
    const unfinedParticipants: Array<number> = [];
    participantsIds.forEach((id: number) => {
      this.store$.select(getParticipant, {participantId: id})
        .pipe(take(1)).subscribe(p => {
        if (!p) {
          unfinedParticipants.push(id);
        }
      });
    })
    const params = {
      filter: {
        field: "id",
        param: "in",
        value: unfinedParticipants,
      },
    };
    if (unfinedParticipants.length > 0) {
      return ConnectyCube.users.get(params)
    }
    return Promise.resolve();
  }

  private processParticipants(users: any) {
    const loginMe = atob(<string>localStorage.getItem("login"));
    const participants: Array<participant> = users.map((u: any) => {
      return {
        id: u.user.id,
        full_name: u.user.full_name,
        login: u.user.login,
        avatar: u.user.avatar,
        me: loginMe === u.user.login
      }
    })
    this.store$.dispatch(addParticipants({participants}))
  }

  private addDialog(dialogId: string, msgCount?: number) {
    const filters = {_id: dialogId};

    ConnectyCube.chat.dialog
      .list(filters)
      .then((result: any) => {
        const dialog: Dialog = builtDialog(result.items[0]);
        if (msgCount) {
          dialog.unreadMessage = msgCount;
        }
        this.store$.dispatch(addDialog({dialog}));
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  private processTypingStatus(userId: number, isTyping: boolean, dialogId: string) {
    if (isTyping) {
      this.store$.select(getParticipant, {participantId: userId})
        .pipe(take(1)).subscribe(participant => {
        if (participant) {
          this.store$.dispatch(addTypingParticipant({dialogId, participant}));
        }
      })
    }
    else {
      this.store$.dispatch(removeTypingParticipant({dialogId, pId: userId}));
    }
  }

  private prepareMessageWithAttachmentAndSend(file: any, dialog: Dialog, senderId: number, tempMsgId: string, msgWidth: number, msgHeight: number) {
    const messageParams = {
      type: dialog.type === 3 ? "chat" : "groupchat",
      body: "attachment",
      extension: {
        save_to_history: 1,
        dialog_id: dialog.id,
        attachments: [{uid: file.uid, id: file.id, type: "photo", width: msgWidth, height: msgHeight}],
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
      this.store$.select(meSelector).pipe(take(1)).subscribe(userMe => {
        if (userMe) {
          const opponentId = dialog.participantIds.find((id: number) => id !== userMe.id);
          message.id = ConnectyCube.chat.send(opponentId, messageParams);
        }
      })
    }
    else {
      message.id = ConnectyCube.chat.send(dialog.id, messageParams);
    }

    if (message.id) {
      message.photo = ConnectyCube.storage.privateUrl(file.uid);
      console.log(message);
      if (message.photo) {
        this.store$.dispatch(updateMessageId({dialogId: dialog.id, currentMsgIds: tempMsgId, newMsgIds: message.id}));
        this.store$.dispatch(updateMessagePhoto({msgId: tempMsgId, photo: message.photo, id: message.id}));
      }
    }
  }

  public init() {
    ConnectyCube.chat.onMessageListener = (userId: any, msg: any) => {
      console.log(userId, msg);

      this.store$.dispatch(updateDialogLastMessage({
        dialogId: msg.extension.dialog_id,
        lastMessage: msg.body,
        lastMessageDate: msg.extension.date_sent,
        lastMessageUserId: userId,
      }))

      this.store$.select(meSelector).pipe(take(1)).subscribe(userMe => {
        if (userMe) {
          if (userMe.id !== userId) {
            this.store$.select(selectedConversationSelector).pipe(take(1))
              .subscribe(selectedConversation => {
                if (selectedConversation === msg.extension.dialog_id) {
                  this.sendReadStatus(msg.id, userId, msg.extension.dialog_id);
                }
              })
            this.store$.dispatch(addOneUnreadMessage({
              dialogId: msg.extension.dialog_id
            }));
          }
        }
      })

      this.store$.select(getParticipant, {participantId: userId})
        .pipe(take(1)).subscribe(p => {
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
            if (msg.extension.attachments[0].height) {
              message.height = +msg.extension.attachments[0].height;
              message.width = +msg.extension.attachments[0].width;
            }
          }

          this.store$.dispatch(addMessageId({dialogId: msg.extension.dialog_id, msgIds: [msg.id]}));
          this.store$.dispatch(addMessage({message}));
        }
      });
    }
    ConnectyCube.chat.onSystemMessageListener = (msg: any) => {
      console.log(msg);
      const dialogId = msg.extension.id;
      switch (msg.body) {
        case "dialog/NEW_DIALOG":
          this.addDialog(dialogId, +msg.extension.msgCount);
          break;
        case "dialog/REMOVE_DIALOG_PARTICIPANT":
          this.store$.dispatch(updateDialogParticipant({dialogId, userId: msg.userId}));
          break;
        case "dialog/ADD_DIALOG_PARTICIPANTS":
          const addedParticipantsIds = msg.extension.addedParticipantsIds.split(',').map(Number);
          this.searchUsersById(addedParticipantsIds)
            .then((result: any) => {
              if (result.items.length !== 0) {
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
              }
            })
            .catch((error: any) => {
              console.error(error);
            })
          this.store$.dispatch(addDialogParticipants({dialogId, userIds: addedParticipantsIds}));
          break;
        case "dialog/UPDATE_DIALOG_PARTICIPANTS":
          const updatedParticipants = msg.extension.updatedParticipants.split(',').map(Number);
          this.store$.dispatch(updateDialogParticipants({dialogId, userIds: updatedParticipants}));
          break;
        case "dialog/REMOVED_FROM_DIALOG":
          this.store$.select(selectedConversationSelector)
            .pipe(take(1)).subscribe(selectedConversation => {
            if (selectedConversation === dialogId) {
              this.router.navigateByUrl("/chat/");
              this.store$.dispatch(setNullConverastion());
            }
            this.store$.dispatch(removeDialog({id: dialogId}));
          })
          break;
      }
    };

    ConnectyCube.chat.onMessageTypingListener = (isTyping: boolean, userId: number, dialogId: string) => {
      //Group dialog
      if (dialogId) {
        this.store$.select(getParticipant, {participantId: userId})
          .pipe(filter(v => !!v), take(1)).subscribe(user => {
          if (!user.me) {
            console.log("GROUP CHAT", isTyping, userId, dialogId);
            this.processTypingStatus(userId, isTyping, dialogId);
          }
        })
      }
      //Individual dialog
      else {
        this.store$.select(getIndividualDialogByParticipantId, {pId: userId}).pipe(take(1))
          .subscribe((dialogId: any) => {
            if (dialogId !== undefined) {
              console.log("INDIVIDUAL CHAT", isTyping, userId, dialogId);
              this.processTypingStatus(userId, isTyping, dialogId);
            }
          })
      }
    };
    ConnectyCube.chat.onSentMessageCallback = (messageLost: any, messageSent: any) => {
      console.log("[onSentMessageCallback]", messageLost, messageSent);
      this.store$.dispatch(updateMessageStatus({msgId: messageSent.id, status: messageSent ? "sent" : "error"}));
    };
    ConnectyCube.chat.onReadStatusListener = (messageId: string, dialogId: string, userId: number) => {
      console.log("[ConnectyCube.chat.onReadStatusListener] callback:", messageId, dialogId, userId);
      this.store$.select(selectedConversationSelector).pipe(filter(v => !!v), take(1))
        .subscribe(selectedConversation => {
          if (selectedConversation === dialogId) {
            if (messageId) {
              this.store$.dispatch(updateMessageStatus({msgId: messageId, status: "read"}));
            }
            else {
              this.store$.select(getUnreadMessageListByStatus(dialogId)).pipe(take(1)).subscribe(msgIds => {
                if (msgIds.length !== 0) {
                  this.store$.dispatch(updateMessagesStatus({msgIds, status: "read"}));
                }
              });
            }
          }
          else {
            this.store$.select(getUnreadMessageListByStatus(dialogId)).pipe(take(1)).subscribe(msgIds => {
              if (msgIds.length !== 0) {
                this.store$.dispatch(updateMessagesStatus({msgIds, status: "read"}));
              }
            });
          }
        })
    };
    ConnectyCube.chat.onLastUserActivityListener = (userId: number, seconds: number) => {
      console.log("[onLastUserActivityListener]", userId, seconds);
      this.store$.dispatch(updateParticipantLastActivity({participantId: userId, lastActivity: seconds}));
    };
  }

  public getDialogs() {
    ConnectyCube.chat.dialog
      .list()
      .then((result: any) => {
        const lastMessageUserIds: Array<number> = []
        const dialogs: Array<Dialog> = result.items.map((d: any) => {
          if (d.type === 2 && d.last_message_user_id) {
            if (!lastMessageUserIds.includes(d.last_message_user_id)) {
              lastMessageUserIds.push(d.last_message_user_id);
            }
          }
          return builtDialog(d);
        })
        console.log("[lastMessageUserIds]", lastMessageUserIds)
        this.searchUsersById(lastMessageUserIds).then((result: any) => {
          console.log("[searchUsersById]", result);
          if (result.items.length > 0) {
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
            console.log("[Processed dialogs]", dialogs);
          }
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

    const urlImage = URL.createObjectURL(file);
    console.log(urlImage);
    this.measureService.measureImage(urlImage).then(({height, width}) => {
      console.log(height, width);

      const message: Message = {
        id: makeid(12),
        body: "",
        senderId: senderId,
        senderName: "",
        status: "pending",
        photo: pathToLoader,
        date_sent: Math.floor(Date.now() / 1000),
        width,
        height
      }

      this.store$.dispatch(addMessageId({dialogId: dialog.id, msgIds: [message.id]}));
      this.store$.dispatch(addMessage({message}));

      ConnectyCube.storage
        .createAndUpload(fileParams)
        .then((result: any) => {
          console.log(result);
          this.prepareMessageWithAttachmentAndSend(result, dialog, senderId, message.id, width, height);
        })
        .catch((error: any) => {
          console.error(error);
        });
    })
  }

  public searchUsersByFullName(fullName: string) {
    const searchParams = {full_name: fullName};

    return ConnectyCube.users
      .get(searchParams)
  }

  public searchUsersById(userIds: Array<number>) {
    if (userIds.length > 0) {
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
    return Promise.resolve({items: []});
  }

  public searchUsersByLogin(login: string) {
    const searchParams = {login: login};
    return ConnectyCube.users
      .get(searchParams)
  }

  public searchMethod(searchForm: any, selectedParticipant: Array<participant>) {
    if (searchForm.valid) {
      const sValue = searchForm.value.name;
      console.log('[Search Value]', sValue);
      const promiseF = this.searchUsersByFullName(sValue);
      const promiseL = this.searchUsersByLogin(sValue);
      Promise.allSettled([promiseF, promiseL]).then((result: any) => {
        console.log(result);
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
        console.log(participants);
        console.log(participantArray);
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
        const dialog: Dialog = builtDialog(d);
        idArray.forEach((ocupantId: number, index: number) => {
          if (index !== 0) {
            const command = "dialog/NEW_DIALOG";
            this.sendSystemMsg(ocupantId, dialog.id, command)
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

        this.store$.select(dialogsSelector).pipe(take(1)).subscribe(res => {
          if (res !== undefined) {
            const thisIsChat = res.some((d: Dialog) => d.id === dialog.id);
            if (!thisIsChat) {
              const command = "dialog/NEW_DIALOG";
              this.sendSystemMsg(ocupantId, dialog.id, command)
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
    return new Promise<void>((resolve, reject) => {
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
          if (result) {
            this.processParticipants(result.items)
          }
          resolve();
          ConnectyCube.chat.message
            .list(params)
            .then((result: any) => {
              const msgs = result.items;
              console.log(msgs)
              const messages: Array<Message> = [];
              const msgIds: Array<string> = [];
              const unfindedUserIds: Array<{ msgId: string, userId: number }> = [];
              msgs.forEach((m: any) => {
                this.store$.select(getParticipant, {participantId: m.sender_id}).pipe(take(1)).subscribe(p => {
                  if (!p) {
                    unfindedUserIds.push({userId: m.sender_id, msgId: m._id});
                  }
                  const sender = p || {me: false, full_name: " "};
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
                    if (m.attachments[0].height) {
                      message.height = +m.attachments[0].height;
                      message.width = +m.attachments[0].width;
                    }
                  }

                  messages.push(message);
                  msgIds.push(m._id);
                });
              })
              console.log("[MESSAGES]", messages);
              console.log("[IDS]", msgIds);

              this.searchUsersById(unfindedUserIds.map((item) => item.userId))
                .then((result: any) => {
                  console.log("[unfindedUsers]", result);
                  if (result.items.length > 0) {
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
                    const updates = unfindedUserIds.map((item) => {
                      const participant: any = participants.find((p: participant) => p.id === item.userId);
                      return {
                        id: item.msgId,
                        changes: {senderName: participant.full_name}
                      }
                    })
                    this.store$.dispatch(updateMessageSendersName({updates}));
                  }
                })
                .catch((error: any) => {
                  console.error(error);
                })

              this.store$.dispatch(addMessages({messages}))
              this.store$.dispatch(addMessagesIds({dialogId, msgIds}))
            })
            .catch((error: any) => {
              console.error(error);
            });
        })
          .catch((error: any) => {
            console.error(error);
          })
      }
      else {
        this.readAllChatMessages(dialogId);
        resolve();
      }
    })
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
        this.store$.select(meSelector).pipe(take(1)).subscribe(userMe => {
          if (userMe) {
            const opponentId = dialog.participantIds.find((id: number) => id !== userMe.id);
            this.store$.dispatch(updateDialogLastMessage({
              dialogId: dialog.id,
              lastMessage: message.body,
              lastMessageDate: message.date_sent,
              lastMessageUserId: message.senderId,
            }))
            message.id = ConnectyCube.chat.send(opponentId, messageParams);
          }
        })
      }
      else {
        message.id = ConnectyCube.chat.send(dialog.id, messageParams);
      }
      this.store$.dispatch(addMessageId({dialogId: dialog.id, msgIds: [message.id]}));
      this.store$.dispatch(addMessage({message}));
      resolve();
    })
  }

  public sendSystemMsg(userId: number, dialogId: string, command: string, params?: any,) {
    const msg = {
      body: command,
      extension: {
        id: dialogId,
        addedParticipantsIds: params?.addedParticipantsIds?.join(),
        msgCount: params?.msgCount,
        updatedParticipants: params?.updatedParticipants?.join()
      }
    };

    ConnectyCube.chat.sendSystemMessage(userId, msg);
  }

  public sendStartTypingStatus(dialog: Dialog) {
    //Group dialog
    if (dialog.type === 2) {
      ConnectyCube.chat.sendIsTypingStatus(dialog.id);
    }
    else {
      this.store$.select(meSelector).pipe(take(1)).subscribe(userMe => {
        if (userMe) {
          const opponentId = dialog.participantIds.find((id: number) => id !== userMe.id);
          ConnectyCube.chat.sendIsTypingStatus(opponentId);
        }
      })
    }
  }

  public sendStopTypingStatus(dialog: Dialog) {
    //Group dialog
    if (dialog.type === 2) {
      ConnectyCube.chat.sendIsStopTypingStatus(dialog.id);
    }
    else {
      this.store$.select(meSelector).pipe(take(1)).subscribe(userMe => {
        if (userMe) {
          const opponentId = dialog.participantIds.find((id: number) => id !== userMe.id);
          ConnectyCube.chat.sendIsStopTypingStatus(opponentId);
        }
      })
    }
  }

  public readAllChatMessages(dialogId: string) {
    const messageIds = "";
    const params = {
      read: 1,
      chat_dialog_id: dialogId,
    };

    this.store$.select(getUnreadMessageListByBadge(dialogId)).pipe(filter(v => !!v), take(1))
      .subscribe(unreadMessageList => {
        if (unreadMessageList.length !== 0) {
          const userIds: Array<any> = [...new Set(unreadMessageList.map((msg: Message) => msg.senderId))];
          userIds.forEach((userId: number) => {
            this.sendReadStatus('', userId, dialogId)
          });
        }
      })

    this.store$.select(getMessagesSelector)

    ConnectyCube.chat.message
      .update(messageIds, params)
      .catch(() => {});
  }

  public sendReadStatus(messageId: string, userId: number, dialogId: string) {
    if (userId) {
      ConnectyCube.chat.sendReadStatus({messageId, userId, dialogId});
    }
  }

  public getLastActivity(userId: number) {
    if (ConnectyCube.chat.isConnected) {
      console.log("[userId]", userId);
      return ConnectyCube.chat
        .getLastUserActivity(userId)
    }
  }

  public subscribeToUserLastActivity(userId: number) {
    if (ConnectyCube.chat.isConnected) {
      console.log("[subscribeToUserLastActivity]", userId)
      ConnectyCube.chat.subscribeToUserLastActivityStatus(userId);
    }
  }

  public unsubscribeFromUserLastActivity(userId: number) {
    if (ConnectyCube.chat.isConnected) {
      console.log("[unsubscribeFromUserLastActivity]", userId)
      ConnectyCube.chat.unsubscribeFromUserLastActivityStatus(userId);
    }
  }

  public removeParticipantFromChat(dialogId: string, ocupantsIds: Array<number>) {
    const toUpdateParams = {pull_all: {occupants_ids: ocupantsIds}};

    return ConnectyCube.chat.dialog
      .update(dialogId, toUpdateParams);
  }

  public addMembersToGroupChat(dialogId: string, ocupantsIds: Array<number>) {
    const toUpdateParams = {push_all: {occupants_ids: ocupantsIds}};

    return ConnectyCube.chat.dialog
      .update(dialogId, toUpdateParams);
  }

}
