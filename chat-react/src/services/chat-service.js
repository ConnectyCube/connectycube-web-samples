/* eslint-disable */
import ConnectyCube from "connectycube";
import { createContext, useRef, useState } from "react";


const ChatContext = createContext();
export default ChatContext;

export const ChatProvider = ({ children }) => {
  const chatsRef = useRef();
  const chosenDialogRef = useRef();
  const [chosenDialog, setChosenDialog] = useState();
  const [dialogs, setDialogs] = useState();
 
  const [connectStatus, setConnectStatus] = useState(false);
  const messagesRef = useRef({});
  const lastActivityRef = useRef({});
  const usersInGroupsRef = useRef([]);
  const [usersInGroups, setUsersInGroups] = useState();
  const [messages, setMessages] = useState();
  const typeStatusRef = useRef({});
  const [typeStatus, setTypeStatus] = useState({});
  const [lastActivity, setLastActivity] = useState(`last seen recent`);
  let timer;

  const chatCallbaks = () => {
    ConnectyCube.chat.onReadStatusListener = function (
      messageId,
      dialogId,
      userId
    ) {
      console.log(
        "[ConnectyCube.chat.onReadStatusListener] callback:",
        messageId,
        dialogId,
        userId
      );
      if (userId !== parseInt(localStorage.userId)) {
        messagesRef.current[dialogId].forEach((message) => {
          message.read = 1;
        });
        setMessages({ ...messagesRef.current });
      }
    };
    ConnectyCube.chat.onMessageTypingListener = function (
      isTyping,
      userId,
      dialogId
    ) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        typeStatusRef.current[userId] = { isTyping: false };
        setTypeStatus({ ...typeStatusRef.current });
      }, 5000);
      dialogId ? "" : lastActivityCheck();
      typeStatusRef.current[userId] = {
        isTyping: isTyping,
        dialogId: dialogId,
      };
      setTypeStatus({ ...typeStatusRef.current });
      console.log(
        "[ConnectyCube.chat.onMessageTypingListener] callback:",
        isTyping,
        userId,
        dialogId
      );
    };

    ConnectyCube.chat.onMessageListener = (userId, message) => {
      typeStatusRef.current[userId] = { isTyping: false };
      setTypeStatus({ ...typeStatusRef.current });
      console.log(
        "[ConnectyCube.chat.onMessageListener] callback:",
        userId,
        message
      );

      if (!chosenDialogRef.current) {
        chatsRef.current.find((el) => {
          if (el._id === message.dialog_id) {
            el.unread_messages_count = el.unread_messages_count + 1;
            el.last_message = message.body;
            el.last_message_date_sent = parseInt(message.extension.date_sent);
          }
          return 0;
        });
      } else if (chosenDialogRef.current._id !== message.dialog_id) {
        chatsRef.current.find((el) => {
          if (el._id === message.dialog_id) {
            el.unread_messages_count = el.unread_messages_count + 1;
            el.last_message = message.body;
            el.last_message_date_sent = parseInt(message.extension.date_sent);
          }
          return 0;
        });
      } else {
        const params = {
          messageId: message.id,
          userId: userId,
          dialogId: message.dialog_id,
        };

        ConnectyCube.chat.sendReadStatus(params);
        chatsRef.current.find((el) => {
          if (el._id === message.dialog_id) {
            el.unread_messages_count = 0;
          }
          return 0;
        });
      }
      setDialogs([...chatsRef.current]);
      if (message.extension.hasOwnProperty("attachments")) {
        if (
          message.extension.attachments.length > 0 &&
          userId !== parseInt(localStorage.userId)
        ) {
          const fileUID = message.extension.attachments[0].uid;
          const fileUrl = ConnectyCube.storage.privateUrl(fileUID);

          addMessageToStore(message, message.dialog_id, userId, fileUrl, false);
          // insert the imageHTML as HTML template
        }
      } else {
        addMessageToStore(message, message.dialog_id, userId);
      }
     
    };

    ConnectyCube.chat.onSystemMessageListener = (msg) => {
      if (msg.body === "dialog/NEW_DIALOG") {
        const filters = { _id: msg.extension.id };
        ConnectyCube.chat.dialog
          .list(filters)
          .then((dialog) => {
            if (dialog.items[0].type === 2) {
              updateGroupUsers(dialog.items[0].occupants_ids)
                .then((users) => {
                  dialog.items[0].unread_messages_count =
                    msg.extension.msgCount;
                  chatsRef.current.unshift(dialog.items[0]);
                  setDialogs([...chatsRef.current]);
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              chatsRef.current.unshift(dialog.items[0]);
              setDialogs([...chatsRef.current]);
            }
          })
          .catch((error) => {});
        
      } else if (msg.body === "dialog/UPDATE_DIALOG_PARTICIPANTS") {
        if (msg.extension.addedParticipantsIds) {
          let userId = msg.extension.addedParticipantsIds.split(",");
          userId = userId.map((e) => {
            return parseInt(e);
          });
          const dialog = chatsRef.current.find((e) => {
            return e._id === msg.extension.id;
          });
          let dialogUsers = dialog.occupants_ids.concat(userId);
          dialogUsers.forEach((user) => {
            user = parseInt(user);
          });
          dialog.occupants_ids = dialogUsers;
          setDialogs([...chatsRef.current]);
          console.log(userId);
        } else {
          let userIds = msg.extension.updatedParticipants.split(",");
          userIds = userIds.map((e) => {
            return parseInt(e);
          });
          const dialog = chatsRef.current.find((e) => {
            return e._id === msg.extension.id;
          });
          userIds.forEach((user) => {
            user = parseInt(user);
          });
          dialog.occupants_ids = userIds;
          setDialogs([...chatsRef.current]);
          console.log(userIds);
        }
      } else if (msg.body === "dialog/REMOVE_DIALOG_PARTICIPANT") {
        chatsRef.current.forEach((dialog) => {
          if (dialog._id === msg.extension.id) {
            dialog.occupants_ids = dialog.occupants_ids.filter((e) => {
              return e !== msg.userId;
            });
          }
        });
        setDialogs([...chatsRef.current]);
      } else if (msg.body === "dialog/REMOVED_FROM_DIALOG") {
        chatsRef.current = chatsRef.current.filter((dialog) => {
          return dialog._id !== msg.extension.id;
        });
        chosenDialogRef.current = undefined;
        setChosenDialog(chosenDialogRef.current);
        setDialogs([...chatsRef.current]);
      }
    };
  };

  chatCallbaks();

  const connectToChat = (chatCredentials) => {
    getChats();
    ConnectyCube.chat
      .connect({
        userId: parseInt(chatCredentials.userId),
        password: chatCredentials.password.token,
      })
      .then(() => {
        console.log("Connected", `chatConnection`);
        setConnectStatus(true);
      })
      .catch((error) => {
        console.log(`Failed connection due to ${error}`);
        setConnectStatus(false);
      });
  };

  const updateGroupUsers = (usersIds) => {
    let users = [];
    return new Promise((resolve, reject) => {
      usersIds.forEach((userId) => {
        if (usersInGroupsRef.current[userId]) {
          console.table("WE HAVE IT ", usersInGroupsRef.current);
        } else {
          users.push(userId);
          console.error("WE DONT HAVE USER " + userId);
        }
      });
      if (users.length > 0) {
        const params = {
          page: 1,
          per_page: 30,
          filter: {
            field: "id",
            param: "in",
            value: users,
          },
        };
        ConnectyCube.users
          .get(params)
          .then((result) => {
            result.items.forEach((user) => {
              usersInGroupsRef.current[user.user.id] = user.user;
              setUsersInGroups({ ...usersInGroupsRef.current });
            });
            resolve(usersInGroupsRef.current);
          })
          .catch((error) => {
            reject();
          });
      } else {
        resolve();
      }
    });
  };

  const updateDialogParticipantsSystemMessage = (
    command,
    dialogId,
    params,
    userId
  ) => {
    const msg = {
      body: command,
      extension: {
        id: dialogId,
        addedParticipantsIds: params?.addedParticipantsIds?.join(),
        updatedParticipants: params?.updatedParticipants?.join(),
        msgCount: params?.msgCount,
      },
    };

    ConnectyCube.chat.sendSystemMessage(userId, msg);
  };

  const addedUsersSystemMessage = (command, dialogId, params, userId) => {
    const msg = {
      body: command,
      extension: {
        id: dialogId,
        addedParticipantsIds: params?.addedParticipantsIds?.join(),
        msgCount: params?.msgCount,
      },
    };

    ConnectyCube.chat.sendSystemMessage(userId, msg);
  };

  const addUsersToGroup = (userId) => {
    const dialogId = chosenDialog._id;

    const usersToSendSystemMessage = chosenDialogRef.current.occupants_ids;
    const toUpdateParams = { push_all: { occupants_ids: userId } };
    ConnectyCube.chat.dialog
      .update(dialogId, toUpdateParams)
      .then((dialog) => {
        const msgCount = messagesRef.current[dialogId].length;
        usersToSendSystemMessage.forEach((id) => {
          updateDialogParticipantsSystemMessage(
            "dialog/UPDATE_DIALOG_PARTICIPANTS",
            dialogId,
            { addedParticipantsIds: userId },
            id
          );
        });
        userId.forEach((id) => {
          addedUsersSystemMessage(
            "dialog/NEW_DIALOG",
            dialogId,
            { msgCount },
            id
          );
        });

        
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeUser = (userId) => {
    const dialogId = chosenDialogRef.current._id;
    const toUpdateParams = { pull_all: { occupants_ids: [userId] } };

    ConnectyCube.chat.dialog
      .update(dialogId, toUpdateParams)
      .then((dialog) => {
        const msg = {
          body: "dialog/REMOVED_FROM_DIALOG",
          extension: { id: dialogId },
        };
        ConnectyCube.chat.sendSystemMessage(userId, msg);

        let updatedParticipants = chosenDialogRef.current.occupants_ids.filter(
          (id) => {
            return id !== userId;
          }
        );
        updatedParticipants.forEach((id) => {
          updateDialogParticipantsSystemMessage(
            "dialog/UPDATE_DIALOG_PARTICIPANTS",
            dialogId,
            { updatedParticipants },
            id
          );
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const prepareMessageWithAttachmentAndSend = (file) => {
    const message = {
      type: chosenDialog.type === 3 ? "chat" : "groupchat",
      body: "attachment",
      extension: {
        save_to_history: 1,
        dialog_id: chosenDialog._id,
        attachments: [{ uid: file.uid, id: file.id, type: "photo" }],
      },
    };

    // send the message
    if (chosenDialog.type === 2) {
      message.id = ConnectyCube.chat.send(chosenDialog._id, message);
    } else {
      const opponentId = chosenDialog.occupants_ids.filter(
        (e) => e !== parseInt(localStorage.userId)
      );

      message.id = ConnectyCube.chat.send(opponentId, message);
      const fileUID = message.extension.attachments[0].uid;
      const fileUrl = ConnectyCube.storage.privateUrl(fileUID);
      message.extension.date_sent = parseInt(new Date().getTime() / 1000);
    }
  };

  const sendMsgWithPhoto = (file, url) => {
    const fileParams = {
      name: file.name,
      file: file,
      type: file.type,
      size: file.size,
      public: false,
    };

    let dialogId = addMessageToStore(
      { extension: { date_sent: parseInt(new Date().getTime() / 1000) } },
      chosenDialogRef.current._id,
      parseInt(localStorage.userId),
      url,
      true
    );

    ConnectyCube.storage
      .createAndUpload(fileParams)
      .then((result) => {
        messagesRef.current[dialogId][
          messagesRef.current[dialogId].length - 1
        ].loading = false;
        setMessages({ ...messagesRef.current });
        prepareMessageWithAttachmentAndSend(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const searchUsers = (userName) => {
    return new Promise((resolve, reject) => {
      const users = [];
      const searchParams = {
        full_name: userName,
        per_page: 100,
        page: 1,
      };
      const searchLogin = { login: userName };
      ConnectyCube.users
        .get(searchParams)
        .then((result) => {
          result.items.forEach((element) => {
            users.push(element.user);
          });

          ConnectyCube.users
            .get(searchLogin)
            .then((result) => {
              users.unshift(result.user);
              resolve(users);
            })
            .catch((error) => {
              resolve(users);
            });
        })
        .catch((error) => {});
    });
  };
  const lastActivityCheck = (id) => {
    ConnectyCube.chat
      .getLastUserActivity(id)
      .then((result) => {
        const userId = result.userId;
        const seconds = result.seconds;

        // 'userId' was 'seconds' ago

        const lastLoggedInTime = new Date(Date.now() - seconds * 1000);

        if (seconds <= 30) {
          lastActivityRef.current[userId] = `Online`;
          setLastActivity({ ...lastActivityRef.current });
        } else if (seconds < 3600) {
          let minutes = Math.ceil(seconds / 60);
          lastActivityRef.current[userId] = `last seen ${minutes} minutes ago`;

          setLastActivity({ ...lastActivityRef.current });
        } else {
          const dateNow = new Date();
          const hourNow = dateNow.getHours();
          let hours = Math.ceil(seconds / 3600);
          if (hourNow - hours <= 0) {
            let day = lastLoggedInTime.getUTCDate();
            let month = lastLoggedInTime.getMonth() + 1;
            month < 10 ? (month = "0" + month) : (month = month);
            let year = lastLoggedInTime.getFullYear();
            lastActivityRef.current[
              userId
            ] = `last seen ${day}/${month}/${year}`;
            setLastActivity({ ...lastActivityRef.current });
          } else {
            lastActivityRef.current[userId] = `last seen ${hours} hours ago`;

            setLastActivity({ ...lastActivityRef.current });
          }
        }
      })
      .catch((error) => {
        lastActivityRef.current[id] = `last seen recently`;
        setLastActivity({ ...lastActivityRef.current });
        console.error(error);
      });
  };

  const sendTypingStatus = (isTyping, opponentId) => {
    isTyping
      ? ConnectyCube.chat.sendIsTypingStatus(opponentId)
      : ConnectyCube.chat.sendIsStopTypingStatus(opponentId);
  };

  const addGroupUsers = (result) => {
    return new Promise((resolve, reject) => {
      chatsRef.current = result.items;
      setDialogs([...chatsRef.current]);

      result.items.forEach((dialog) => {
        if (dialog.type === 2) {
          dialog.occupants_ids.forEach((userId) => {
            usersInGroupsRef.current.push(userId);
          });
        }
      });

      usersInGroupsRef.current = [...new Set(usersInGroupsRef.current)];
      console.table(usersInGroupsRef.current);
      setUsersInGroups([...usersInGroupsRef.current]);

      resolve();
    });
  };

  const leaveGroupChat = () => {
    const dialogId = chosenDialogRef.current._id;
    const msg = {
      body: "dialog/REMOVE_DIALOG_PARTICIPANT",
      extension: { id: dialogId },
    };
    const toUpdateParams = {
      pull_all: { occupants_ids: [parseInt(localStorage.userId)] },
    };

    ConnectyCube.chat.dialog
      .update(dialogId, toUpdateParams)
      .then((dialog) => {
        chosenDialogRef.current.occupants_ids.forEach((id) => {
          if (id !== parseInt(localStorage.userId)) {
            ConnectyCube.chat.sendSystemMessage(id, msg);
          }
        });
        chatsRef.current = chatsRef.current.filter((dialog) => {
          return dialog._id !== chosenDialogRef.current._id;
        });
        setDialogs([...chatsRef.current]);
        chosenDialogRef.current = undefined;
        setChosenDialog(chosenDialogRef.current);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const getChats = () => {
    const filters = {};
    ConnectyCube.chat.dialog
      .list(filters)
      .then((result) => {
        addGroupUsers(result)
          .then(() => {
            const params = {
              page: 1,
              per_page: 5000,
              filter: {
                field: "id",
                param: "in",
                value: usersInGroupsRef.current,
              },
            };

            ConnectyCube.users
              .get(params)
              .then((result) => {
                usersInGroupsRef.current = {};
                result.items.forEach((user) => {
                  usersInGroupsRef.current[user.user.id] = user.user;
                  setUsersInGroups({ ...usersInGroupsRef.current });
                });
              })
              .catch((error) => {
                console.log("ОШИБКА");
              });
          })
          .catch((error) => {
            console.error(error);
            console.log("ОШИБКА");
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const dialogSystemMessage = (userId, dialogId) => {
    const msg = {
      body: "dialog/NEW_DIALOG",
      extension: {
        id: `${dialogId}`,
      },
    };
    ConnectyCube.chat.sendSystemMessage(userId, msg);
  };

  const startGroupChat = (occupants, groupName) => {
    let usersIds = [];
    occupants.forEach((user) => {
      usersIds.push(user.id);
    });

    const params = {
      type: 2,
      name: groupName,
      occupants_ids: usersIds,
      description: "New group",
    };

    ConnectyCube.chat.dialog
      .create(params)
      .then((dialog) => {
        usersIds.forEach((userId) => {
          dialogSystemMessage(userId, dialog._id);
        });
        chatsRef.current.unshift(dialog);
        setDialogs([...chatsRef.current]);
        setDialog(dialog);
      })
      .catch((error) => {});
  };

  const startChat = (userId) => {
    const params = {
      type: 3,
      occupants_ids: [userId],
    };
    ConnectyCube.chat.dialog
      .create(params)
      .then((dialog) => {
        let dialogIs = chatsRef.current.find((e) => {
          return e._id === dialog._id;
        });
        if (!dialogIs) {
          dialogSystemMessage(userId, dialog._id);
          chatsRef.current.unshift(dialog);
          setDialogs([...chatsRef.current]);
        }
        setDialog(dialog);
      })
      .catch((error) => {});
  };

  const setDialog = (dialog) => {
    if (dialog === "close") {
      chosenDialogRef.current = undefined;
      setChosenDialog(chosenDialogRef.current);
    } else {
      let chat = chatsRef.current.find((chat) => {
        return chat._id === dialog._id;
      });
      chosenDialogRef.current = chat;
      let was_unread = dialog.unread_messages_count;

      setChosenDialog(dialog);
      getMessages(dialog)
        .then(() => {
          let messages = messagesRef.current[dialog._id];
          let users = [];
          for (let i = 1; i <= was_unread; i += 1) {
            users.push(messages[messages.length - i].sender_id);
          }
          const uniqueUsers = new Set(users);
          uniqueUsers.forEach((id) => {
            if (id !== parseInt(localStorage.userId)) {
              readAllChatMessages(id);
            }
          });
          messagesRef.current[dialog._id].reverse();
        })
        .catch((error) => {
          console.log(error);
        });
      chosenDialogRef.current.occupants_ids.forEach((id) => {
        lastActivityCheck(id);
      });

      chosenDialogRef.current = dialog;
      setChosenDialog(dialog);
    
      chatsRef.current.find((el) => {
        if (el._id === dialog._id) {
          el.unread_messages_count = 0;
        }
      });
      setDialogs([...chatsRef.current]);
    }
  };

  const readAllChatMessages = (userId) => {
    const messageIds = ""; // use "" to update all
    let params = {
      read: 1,
      chat_dialog_id: chosenDialogRef.current._id,
    };

    ConnectyCube.chat.message
      .update("", params)
      .then(() => {
        let params = {
          userId: userId,
          dialogId: chosenDialogRef.current._id,
        };

        ConnectyCube.chat.sendReadStatus(params);
      })
      .catch((error) => {});
  };
  const addMessageToStore = (message, dialogId, userId, fileUrl, loading) => {
    let chat = chatsRef.current.find((e) => e._id === dialogId);
    chat.last_message_date_sent = parseInt(new Date().getTime() / 1000);
    if (typeof message === "object") {
      chat.last_message = message.body;
      chat.last_message_user_id = userId;
      if (userId) {
        if (fileUrl) {
          chat.last_message = "Photo";
          chat.last_message_user_id = userId;
          messagesRef.current[dialogId].push({
            fileUrl: fileUrl,
            sender_id: userId,
            date_sent: parseInt(message.extension.date_sent),
            loading: loading,
          });
          setMessages(messagesRef.current);
          return dialogId;
        } else {
          if (messagesRef.current[dialogId]) {
            messagesRef.current[dialogId].push({
              message: message.body,
              sender_id: userId,
              date_sent: parseInt(message.extension.date_sent),
            });
          }
        }
      } else {
        messagesRef.current[dialogId].push(message);
      }
    } else {
      chat.last_message = message;
      chat.last_message_user_id = parseInt(localStorage.userId);
      messagesRef.current[dialogId].push({
        message: message,
        sender_id: parseInt(localStorage.userId),
        date_sent: parseInt(new Date().getTime() / 1000),
      });
    }
    setMessages({ ...messagesRef.current });
  };

  const sendMessage = (dialog, message, opponentId) => {
    const messageToSend = {
      type: dialog.type === 3 ? "chat" : "groupchat",
      body: message,
      extension: {
        save_to_history: 1,
        dialog_id: dialog._id,
      },
    };
    if (dialog.type === 3) {
      addMessageToStore(message, dialog._id);
      ConnectyCube.chat.send(opponentId, messageToSend);
    } else {
      ConnectyCube.chat.send(dialog._id, messageToSend);
    }
  };

  const getMessages = (dialog) => {
    return new Promise((resolve, reject) => {
      chosenDialogRef.current = dialog;
      let key = dialog._id;
      if (chosenDialogRef.current) {
        if (messagesRef.current[key] === undefined) {
          const dialogId = dialog._id;
          const params = {
            chat_dialog_id: dialogId,
            sort_desc: "date_sent",
            limit: 100,
            skip: 0,
          };
          ConnectyCube.chat.message
            .list(params)
            .then((messages) => {
             
              if (messages.items) {
                messagesRef.current[key] = new Array();

                messages.items.map((e) => {
                  if (e.attachments.length > 0) {
                    const fileUrl = ConnectyCube.storage.privateUrl(
                      e.attachments[0].uid
                    );
                    messagesRef.current[key].push({
                      fileUrl: fileUrl,
                      sender_id: e.sender_id,
                      date_sent: e.date_sent,
                    });
                  } else {
                    messagesRef.current[key].push(e);
                  }

                  return 0;
                });

                setMessages({ ...messagesRef.current });
              }
              resolve(messages);
            })
            .catch((error) => {
              console.log(error);
              reject();
            });
        } else {
          resolve();
          setMessages({ ...messagesRef.current });
        }
      }
    });
  };

  return (
    <ChatContext.Provider
      value={{
        connectToChat,
        getChats,
        dialogs,
        chosenDialog,
        setDialog,
        getMessages,
        messages,
        sendMessage,
        startGroupChat,
        startChat,
        usersInGroups,
        searchUsers,
        sendTypingStatus,
        typeStatus,
        sendMsgWithPhoto,
        lastActivity,
        connectStatus,
        removeUser,
        addUsersToGroup,
        leaveGroupChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
