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
import { getCurrentUser, destroyUserSession } from "../../../connectycube";
import ChatsTab from "./Tabs/ChatsTab";
import UsersTab from "./Tabs/UsersTab";
import Avatar from "@/Components/Shared/Avatar";
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
    <div
      className={cn(
        "flex flex-col bg-white border-r border-gray-300 relative transition-transform w-full",
        "md:max-w-[35%] lg:max-w-[30%] xl:max-w-[25%]",
        selectedDialog ? "hidden sm:block" : ""
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-300">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="flex items-center flex-row-reverse cursor-pointer bg-white">
            <p className="text-center ml-2">{getCurrentUser()?.login}</p>
            <Avatar
              imageUID={getCurrentUser()?.avatar || undefined}
              name={getCurrentUser()?.login || undefined}
              className="w-[60px] h-[60px]"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chats" className="flex flex-col overflow-y-scroll">
        <TabsContent
          value="chats"
          className={`${showUsersTab ? "h-[calc(100%-60px)]" : "h-full"}`}
        >
          <ChatsTab />
        </TabsContent>
        {showUsersTab && (
          <TabsContent value="users" className="h-[calc(100%-60px)]">
            <UsersTab />
          </TabsContent>
        )}
        <TabsList
          className={`w-full absolute bottom-0 ${
            showUsersTab ? "h-[40px]" : "h-[0px]"
          }`}
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
