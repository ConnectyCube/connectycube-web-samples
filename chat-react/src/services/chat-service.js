import ConnectyCube from "connectycube";
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

  const [messages, setMessages] = useState();
  const [chatStory, setChatStory] = useState();
  const chatCallbaks = () => {
    ConnectyCube.chat.onMessageListener = (userId, message) => {
      console.log(
        "[ConnectyCube.chat.onMessageListener] callback:",
        userId,
        message
      );

      addMessageToStore(message);
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

  const getChats = () => {
    const filters = {};
    ConnectyCube.chat.dialog
      .list(filters)
      .then((result) => {
        chatsRef.current = result.items;
        setDialogs([...chatsRef.current]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const startGroupChat = (occupants, groupName) => {
    const params = {
      type: 2,
      name: groupName,
      occupants_ids: occupants,
      description: "New group",
    };

    ConnectyCube.chat.dialog
      .create(params)
      .then((dialog) => {
        getChats();
      })
      .catch((error) => {});
  };

  const setDialog = (dialog) => {
    setChosenDialog(dialog);
  };

  const addMessageToStore = (message, dialogId) => {
    if (typeof e === "object") {
      messagesRef.current[dialogId].push(message);
    } else {
      messagesRef.current[dialogId].push({
        message: message,
        sender_id: parseInt(localStorage.userId),
        timestamp: new Date().getTime(),
      });
    }
    setMessages({ ...messagesRef.current });
  };

  const sendMessage = (dialog, message, opponentId) => {
    addMessageToStore(message, dialog._id);
    const messageToSend = {
      type: dialog.type === 3 ? "chat" : "groupchat",
      body: message,
      extension: {
        save_to_history: 1,
        dialog_id: dialog._id,
      },
      markable: 1,
    };

    ConnectyCube.chat.send(opponentId, messageToSend);
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
              messagesRef.current[key] = new Array();
              messages.items.map((e) => {
                messagesRef.current[key].unshift(e);
                return 0;
              });
              setMessages({ ...messagesRef.current });

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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
