import React from "react";
import "./Home.scss";
import Main from "./Main/Main";
import Sidebar from "./Sidebar/Sidebar";

const Home = (props) => {
  const { dialogs, connectToChat } = props.chat;
  return (
    <div className="home__container">
      <Sidebar
        className="sidebar__block"
        dialogs={dialogs}
        connect={connectToChat}
      />
      <Main className="main__block" />
    </div>
  );
};

export default Home;
