import ConnectyCube from "connectycube";
import { createContext, useRef, useState } from "react";
import { isiOS } from "./heplers";

import sound from "../sounds/notification_sound.mp3";

const ChatContext = createContext();
export default ChatContext;

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const chatParticipantsRef = useRef([]);
  console.log("MSGS", messages);
  const messagesRef = useRef([]);

  const chatCallbaks = () => {
    ConnectyCube.chat.onMessageListener = (userId, message) => {
      console.log(
        "[ConnectyCube.chat.onMessageListener] callback:",
        userId,
        message
      );
      if (!isiOS()) {
        if (userId !== chatParticipantsRef.current[0].userId) {
          let audio = new Audio(sound);
          audio.play();
        }
      }
      message.sender_id = userId;
      message.message = message.body;
      processMessages([message], chatParticipantsRef.current).then((msgs) => {
        console.log("[ConnectyCube.chat.onMessageListener]:", messages, msgs);
        messagesRef.current = messagesRef.current.concat(msgs);
        setMessages(messagesRef.current);
      });
    };
  };
  const joinChat = (roomId) => {
    return new Promise((resolve, reject) => {
      ConnectyCube.meeting
        .get({ _id: roomId })
        .then((meeting) => {
          ConnectyCube.chat.dialog
            .subscribe(meeting.chat_dialog_id)
            .then((dialog) => {
              resolve(dialog);
            })
            .catch((error) => {
              console.error(error);
            })
            .catch((error) => {});
        })
        .catch((error) => {});
    });
  };
  const sendMessage = (messageText, dialogId) => {
    const message = {
      type: "groupchat",
      body: messageText,
      extension: {
        save_to_history: 1,
      },
    };
    ConnectyCube.chat.send(dialogId, message);
  };

  const getMessages = (chat_id, participants) => {
    chatCallbaks();
    const params = {
      chat_dialog_id: chat_id,
      sort_desc: "date_sent",
      limit: 100,
      skip: 0,
    };
    ConnectyCube.chat.message
      .list(params)
      .then((resp) => {
        console.table(resp.items);
        processMessages(resp.items, participants).then((msgs) => {
          chatParticipantsRef.current = participants;
          console.table(msgs);
          messagesRef.current = msgs;
          setMessages(msgs);
        });
      })
      .catch((error) => {});
  };
  const processMessages = async (records, participants) => {
    const messagesBySender = {};
    records.forEach((m) => {
      let msgs = messagesBySender[m.sender_id];
      if (!msgs) {
        msgs = [];
      }
      msgs.push(m);
      messagesBySender[m.sender_id] = msgs;
    });
    for (let senderId of Object.keys(messagesBySender)) {
      // find user
      const notFoundUsersIds = [];

      for (let i = 0; i < participants.length; i += 1) {
        let participant = participants[i];
        if (participant.userId === parseInt(senderId)) {
          const name = i === 0 ? "me" : participant.name;
          messagesBySender[senderId].forEach((m) => {
            m.senderName = name;
          });
          break;
        } else {
          notFoundUsersIds.push(senderId);
        }
      }

      if (notFoundUsersIds.length > 0) {
        const params = {
          filter: {
            field: "id",
            param: "in",
            value: notFoundUsersIds.map((id) => parseInt(id)),
          },
        };

        const users = await ConnectyCube.users.get(params);
        users.items.forEach((rec) => {
          const uID = rec.user.id;
          console.log("messagesBySender", messagesBySender, uID);
          messagesBySender[uID].forEach((m) => {
            m.senderName = rec.user.full_name;
          });
        });
      }
    }

    return records;
  };
  return (
    <ChatContext.Provider
      value={{ sendMessage, messages, getMessages, joinChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};
