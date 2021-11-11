import ConnectyCube from "connectycube";
export const sendMessage = (messageText, dialogId) => {
  const message = {
    type: "groupchat",
    body: messageText,
    extension: {
      save_to_history: 1,
    },
  };
  ConnectyCube.chat.send(dialogId, message);
};
