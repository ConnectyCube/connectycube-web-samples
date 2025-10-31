import { ConnectyCube } from "@connectycube/react";
import { createContext, useRef, useState } from "react";
import { isiOS } from "./helpers";

import sound from "../sounds/notification_sound.mp3";

const ChatContext = createContext();
export default ChatContext;

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const chatParticipantsRef = useRef([]);
  const messagesRef = useRef([]);

  const joinChat = async (roomId) => {
    const meeting = await ConnectyCube.meeting.get({ _id: roomId });

    const dialog = await ConnectyCube.chat.dialog.subscribe(
      meeting.chat_dialog_id
    );

    return dialog;
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

  const setParticipants = (participants) => {
    chatParticipantsRef.current = participants;
  };

  const getMessages = async (dialogId) => {
    const params = {
      chat_dialog_id: dialogId,
      sort_desc: "date_sent",
      limit: 100,
      skip: 0,
    };
    const response = await ConnectyCube.chat.message.list(params);

    const msgs = await processMessages(
      response.items,
      chatParticipantsRef.current
    );
    messagesRef.current = msgs;
    setMessages(msgs);
  };

  const chatCallbaсks = () => {
    ConnectyCube.chat.onMessageListener = (userId, message) => {
      if (!isiOS()) {
        if (userId !== chatParticipantsRef.current[0].userId) {
          let audio = new Audio(sound);
          audio.play();
        }
      }
      message.sender_id = userId;
      message.message = message.body;

      processMessages([message], chatParticipantsRef.current).then((msgs) => {
        messagesRef.current = messagesRef.current.concat(msgs);
        setMessages(messagesRef.current);
      });
    };
  };

  const processMessages = async (records) => {
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
      for (let i = 0; i < chatParticipantsRef.current.length; i += 1) {
        let participant = chatParticipantsRef.current[i];
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
          id: {
            in: notFoundUsersIds.map((id) => parseInt(id)),
          },
        };
        const users = await ConnectyCube.users.getV2(params);
        users.items.forEach((user) => {
          const uID = user.id;
          messagesBySender[uID].forEach((m) => {
            m.senderName = user.full_name;
          });
        });
      }
    }
    return records;
  };

  const sortedMessages = messages.sort((a, b) => {
    if (a.date_sent < b.date_sent) {
      return -1;
    }
    if (a.date_sent > b.date_sent) {
      return 1;
    }
    return 0;
  });

  return (
    <ChatContext.Provider
      value={{
        sendMessage,
        sortedMessages,
        getMessages,
        joinChat,
        setParticipants,
        chatCallbaсks,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
