import React, { useContext } from "react";
import { useNavigate } from "react-router";
import Main from "./Main/Main";
import Sidebar from "./Sidebar/Sidebar";
import { useEffect } from "react";
import ChatContext from "../../services/chat-service";
import "./Home.scss";

const Home = () => {
  const { chosenDialog } = useContext(ChatContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!localStorage.token) {
      navigate("/login");
    } else if (!chosenDialog) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="home__container">
      <Sidebar className="sidebar__block" />
      <Main className="main__block" />
    </div>
  );
};

export default Home;
