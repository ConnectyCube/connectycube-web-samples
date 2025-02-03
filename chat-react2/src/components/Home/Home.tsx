import { useNavigate } from "react-router";
import Main from "./Main/Main";
import SideBar from "./Sidebar/SideBar";
import { useEffect } from "react";
import { useChat } from "@connectycube/use-chat";
import { chatCredentials } from "../../connectycube";

const Home = () => {
  const navigate = useNavigate();
  const { selectedDialog, connect } = useChat();

  useEffect(() => {
    // auto-connect
    connect(chatCredentials());

    if (!selectedDialog) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="w-full h-full flex">
      <SideBar showUsersTab={false} />
      <Main />
    </div>
  );
};

export default Home;
