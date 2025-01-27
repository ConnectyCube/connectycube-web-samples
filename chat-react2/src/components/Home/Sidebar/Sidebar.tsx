import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useChat } from "@connectycube/use-chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn-ui/tabs";
import { currentUser, destroyUserSession } from "../../../connectycube";
import "./Sidebar.scss";
import ChatsTab from "./Tabs/ChatsTab";
import UsersTab from "./Tabs/UsersTab";
import { cn } from "@/lib/utils";

export interface SideBarProps {
  showUsersTab?: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ showUsersTab }) => {
  const navigate = useNavigate();
  const { disconnect, selectedDialog, getDialogs } = useChat();

  // retrieve chats
  useEffect(() => {
    getDialogs();
  }, []);

  const handleLogout = async () => {
    disconnect();
    await destroyUserSession();
    navigate("/login");
  };

  return (
    <div className={`sidebar__container ${selectedDialog ? "" : "show"}`}>
      {/* header */}
      <div className="sidebar__header sidebar-header">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="sidebar-user__info">
            <span className="sidebar-user__name">{currentUser()?.login}</span>
            <div className="sidebar-img__container">
              <div id="background" className="user__no-img main">
                <span className="name">{currentUser()?.login.slice(0, 2)}</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* tabs */}
      <Tabs defaultValue="chats" className="flex flex-col">
        <TabsContent
          value="chats"
          className={cn(showUsersTab ? "h-[calc(100%-60px)]" : "h-full")}
        >
          <ChatsTab />
        </TabsContent>
        {showUsersTab && (
          <TabsContent value="users" className="h-[calc(100%-60px)]">
            <UsersTab />
          </TabsContent>
        )}
        <TabsList
          className={cn(
            "w-full absolute bottom-0",
            showUsersTab ? "h-[40px]" : "h-[0px]"
          )}
        >
          {showUsersTab && (
            <>
              <TabsTrigger value="chats" className="w-[50%] h-[40px]">
                Chats
              </TabsTrigger>
              <TabsTrigger value="users" className="w-[50%] h-[40px]">
                Users
              </TabsTrigger>
            </>
          )}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default SideBar;
