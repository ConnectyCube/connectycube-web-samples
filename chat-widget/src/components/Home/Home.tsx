// import { useNavigate } from "react-router";
import Main from "./Main/Main";
import Sidebar from "./Sidebar/Sidebar";
import { useEffect } from "react";
import { useChat } from "@connectycube/use-chat";
import "./Home.scss";
import { chatCredentials } from "../../connectycube";

const Home = () => {
  // const navigate = useNavigate();
  const { connect } = useChat();

  useEffect(() => {
    // auto-connect
    connect(chatCredentials());

    // if (!selectedDialog) {
    //   navigate("/home");
    // }
  }, []);

  return (
    <div className="home__container">
      <Sidebar />
      <Main />
    </div>
  );
};

export default Home;
