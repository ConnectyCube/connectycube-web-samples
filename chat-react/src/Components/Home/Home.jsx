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
      />
      <Main
        className="main__block"
        getMessages={getMessages}
        messages={messages}
        dialogs={dialogs}
        sendMessage={sendMessage}
        chosenDialog={chosenDialog}
      />
    </div>
  );
};

export default Home;
