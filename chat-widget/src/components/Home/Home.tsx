import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useChat } from "@connectycube/use-chat";
import { chatCredentials } from "../../connectycube";
import Main from "./main/main";
import SideBar from "./sidebar/sidebar";

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
