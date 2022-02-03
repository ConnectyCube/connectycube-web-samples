/* eslint-disable */
import ConnectyCube from "connectycube";
import { createContext, useRef, useState } from "react";
// import { isiOS } from "./heplers";
//import sound from "../sounds/notification_sound.mp3";

const ChatContext = createContext();
export default ChatContext;

export const ChatProvider = ({ children }) => {
  const chatsRef = useRef();
  const chosenDialogRef = useRef();
  const [chosenDialog, setChosenDialog] = useState();
  const [dialogs, setDialogs] = useState();
  //   const messagesRef = useRef([]);
  const [connectStatus, setConnectStatus] = useState(false);
  const messagesRef = useRef({});
  const usersInGroupsRef = useRef([]);
  const [usersInGroups, setUsersInGroups] = useState();
  const [messages, setMessages] = useState();
  const typeStatusRef = useRef({});
  const [typeStatus, setTypeStatus] = useState({});
  const [lastActivity, setLastActivity] = useState(`last seen recent`);
  let timer;
  const chatCallbaks = () => {
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
        debugger;
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
      // if (!isiOS()) {
      //   if (userId !== chatParticipantsRef.current[0].userId) {
      //     let audio = new Audio(sound);
      //     audio.play();
      //   }
      // }
      // message.sender_id = userId;
      // message.message = message.body;
      // processMessages([message], chatParticipantsRef.current).then((msgs) => {
      //   console.log("[ConnectyCube.chat.onMessageListener]:", messages, msgs);
      //   messagesRef.current = messagesRef.current.concat(msgs);
      //   setMessages(messagesRef.current);
      // });
    };

    ConnectyCube.chat.onSystemMessageListener = (msg) => {
      if (msg.extension.name === "New Dialog") {
        const filters = { _id: msg.body };
        ConnectyCube.chat.dialog
          .list(filters)
          .then((dialog) => {
            if (dialog.items[0].type === 2) {
              updateGroupUsers(dialog.items[0].occupants_ids)
                .then((users) => {
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
        // chatsRef.current.unshift(dialog);
        // setDialogs([...chatsRef.current]);
        // setDialog(dialog);
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

  const removeUser = (userId) => {
    const dialogId = chosenDialog._id;
    const toUpdateParams = { pull_all: { occupants_ids: [userId] } };

    ConnectyCube.chat.dialog
      .update(dialogId, toUpdateParams)
      .then((dialog) => {
     
        let dialogToUpdate = chatsRef.current.find((e) => {
          return e._id === dialog._id;
        });
        dialogToUpdate.occupants_ids = dialog.occupants_ids;
        dialogToUpdate.occupants_count = dialog.occupants_ids.length;
        debugger;

        setDialogs([...chatsRef.current]);
      })
      .catch((error) => {});
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
  const lastActivityCheck = () => {
    try {
      let userId = chosenDialogRef.current.occupants_ids.filter(
        (e) => e !== parseInt(localStorage.userId)
      );

      ConnectyCube.chat
        .getLastUserActivity(userId[0])
        .then((result) => {
          const userId = result.userId;
          const seconds = result.seconds;
          // 'userId' was 'seconds' ago

          const lastLoggedInTime = new Date(Date.now() - seconds * 1000);

          if (seconds <= 30) {
            setLastActivity(`Online`);
          } else if (seconds < 3600) {
            let minutes = Math.ceil(seconds / 60);
            setLastActivity(`last seen ${minutes} minutes ago`);
          } else {
            const dateNow = new Date();
            const hourNow = dateNow.getHours();
            let hours = Math.ceil(seconds / 3600);
            if (hourNow - hours <= 0) {
              let day = lastLoggedInTime.getUTCDate();
              let month = lastLoggedInTime.getMonth() + 1;
              month < 10 ? (month = "0" + month) : (month = month);
              let year = lastLoggedInTime.getFullYear();
              setLastActivity(`last seen ${day}/${month}/${year}`);
            } else {
              setLastActivity(`last seen ${hours} hours ago`);
            }
          }
        })
        .catch((error) => {
          setLastActivity(`last seen recently`);
          console.error(error);
        });
    } catch {}
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
              .catch((error) => {});
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const dialogSystemMessage = (userId, dialogId) => {
    const msg = {
      body: `${dialogId}`,
      extension: {
        name: "New Dialog",
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
      chatsRef.current.find((el) => {
        if (el._id === dialog._id) {
          el.unread_messages_count = 0;
        }
      });
      setDialogs([...chatsRef.current]);
      chosenDialogRef.current = dialog;
      setChosenDialog(dialog);
      chosenDialogRef.current.type === 2
        ? setLastActivity("")
        : lastActivityCheck();
    }
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
          messagesRef.current[dialogId].push({
            message: message.body,
            sender_id: userId,
            date_sent: parseInt(message.extension.date_sent),
          });
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
      let key = dialog._id;
      if (chosenDialog) {
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
              // messagesRef.current = [];
              if (messages.items) {
                messagesRef.current[key] = new Array();

                messages.items.map((e) => {
                  if (e.attachments.length > 0) {
                    const fileUrl = ConnectyCube.storage.privateUrl(
                      e.attachments[0].uid
                    );
                    messagesRef.current[key].unshift({
                      fileUrl: fileUrl,
                      sender_id: e.sender_id,
                      date_sent: e.date_sent,
                    });
                  } else {
                    messagesRef.current[key].unshift(e);
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
