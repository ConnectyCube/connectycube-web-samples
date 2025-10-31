import { useNavigate } from "react-router";
import Main from "./main/Main";
import SideBar from "./sidebar/Sidebar";
import { useEffect } from "react";
import { useConnectyCube} from "@connectycube/react";
import { chatCredentials } from "../../connectycube";

const Home = () => {
  const navigate = useNavigate();
  const { selectedDialog, connect } = useConnectyCube();

  useEffect(() => {
    // auto-connect
    const params = chatCredentials()

    if (params) {
      connect(params);
    }

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
