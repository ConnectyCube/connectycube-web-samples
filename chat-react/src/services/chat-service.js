import ConnectyCube from "connectycube";
import { debug } from "connectycube/lib/cubeConfig";
import { createContext, useRef, useState } from "react";
// import { isiOS } from "./heplers";
//import sound from "../sounds/notification_sound.mp3";

const ChatContext = createContext();
export default ChatContext;

export const ChatProvider = ({ children }) => {
  const chatsRef = useRef();
  const [chosenDialog, setChosenDialog] = useState();
  const [dialogs, setDialogs] = useState();
  //   const messagesRef = useRef([]);
  const messagesRef = useRef({});
  const usersInGroupsRef = useRef([]);
  const [usersInGroups, setUsersInGroups] = useState();
  const [messages, setMessages] = useState();
  const chatCallbaks = () => {
    ConnectyCube.chat.onMessageListener = (userId, message) => {
      console.log(
        "[ConnectyCube.chat.onMessageListener] callback:",
        userId,
        message
      );

      addMessageToStore(message, message.dialog_id, userId);
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
                  setDialog(dialog.items[0]);
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              chatsRef.current.unshift(dialog.items[0]);
              setDialogs([...chatsRef.current]);
              setDialog(dialog.items[0]);
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
      })
      .catch((error) => {
        console.log(`Failed connection due to ${error}`);
      });
  };

  const updateGroupUsers = (usersIds) => {
    let users = new Array();
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
      let s = usersInGroupsRef.current;
      console.table(s);
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
    chatsRef.current.find((el) => {
      if (el._id === dialog._id) {
        el.unread_messages_count = 0;
      }
    });
    setDialogs([...chatsRef.current]);
    setChosenDialog(dialog);
  };

  const addMessageToStore = (message, dialogId, userId) => {
    let timeNow = new Date().getTime();
    if (typeof message === "object") {
      if (userId) {
        messagesRef.current[dialogId].push({
          message: message.body,
          sender_id: userId,
          date_sent: parseInt(message.extension.date_sent),
        });
      } else {
        messagesRef.current[dialogId].push(message);
      }
    } else {
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
                  messagesRef.current[key].unshift(e);
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
