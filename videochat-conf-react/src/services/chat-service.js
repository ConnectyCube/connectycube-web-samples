import ConnectyCube from "connectycube";
import { createContext, useRef, useState } from "react";
const ChatContext = createContext();
export default ChatContext;

export const ChatProvider = ({ children }) => {
  const processMessages = async (records, participants) => {
    debugger;
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

      // console.log("notFoundUsersIds", notFoundUs?ersIds);
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
  const [messages, setMessages] = useState([]);

  console.log("MSGS", messages);
  const messagesRef = useRef([]);

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
    const params = {
      chat_dialog_id: chat_id,
      sort_desc: "date_sent",
      limit: 100,
      skip: 0,
    };
    ConnectyCube.chat.message
      .list(params)
      .then((resp) => {
        debugger;
        console.table(resp.items);
        processMessages(resp.items, participants).then((msgs) => {
          console.table(msgs);
          messagesRef.current = msgs;
          setMessages(msgs);
        });
      })
      .catch((error) => {});
  };
  return (
    <ChatContext.Provider value={{ sendMessage, messages, getMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
