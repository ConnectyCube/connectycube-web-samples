import React from "react";
import "./Home.scss";
import Main from "./Main/Main";
import Sidebar from "./Sidebar/Sidebar";

const Home = (props) => {
  const {
    dialogs,
    connectToChat,
    getChats,
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
  } = props.chat;
  return (
    <div className="home__container">
      <Sidebar
        className="sidebar__block"
        dialogs={dialogs}
        connect={connectToChat}
        getChats={getChats}
        setDialog={setDialog}
        chosenDialog={chosenDialog}
        startGroupChat={startGroupChat}
        startChat={startChat}
        searchUsers={searchUsers}
        typeStatus={typeStatus}
        lastActivity={lastActivity}
		  connectStatus={connectStatus}
      />
      <Main
        className="main__block"
        getMessages={getMessages}
        messages={messages}
        dialogs={dialogs}
        sendMessage={sendMessage}
        sendMsgWithPhoto={sendMsgWithPhoto}
        chosenDialog={chosenDialog}
        usersInGroups={usersInGroups}
        setDialog={setDialog}
        sendTypingStatus={sendTypingStatus}
        typeStatus={typeStatus}
        lastActivity={lastActivity}
      />
    </div>
  );
};

export default Home;
