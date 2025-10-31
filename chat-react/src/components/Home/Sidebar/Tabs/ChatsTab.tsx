import { useState } from "react";
import { useConnectyCube } from "@connectycube/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/shadcn-ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { BsPencil } from "react-icons/bs";
import NewChatDialog, { ChatType } from "../NewChat/NewChatDialog";
import ChatsList from "../ChatsList";

const ChatsTab: React.FC = () => {
  const { isConnected } = useConnectyCube();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [chatType, setChatType] = useState<ChatType>("private");
  const [newChatDialogOpen, setNewChatDialogOpen] = useState<boolean>(false);

  const handleNewMessage = () => {
    setChatType("private");
  };

  const handleCreateGroupChat = () => {
    setChatType("group");
  };

  return (
    <div className="flex flex-col">
      <input
        type="text"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        className="mx-5 border border-gray-300 p-2 rounded-full bg-transparent placeholder-gray-500"
        placeholder="Search..."
      />
      {isConnected ? (
        <div className="pt-5 overflow-auto h-[87%] overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300">
          <ChatsList searchTerm={searchTerm} />
        </div>
      ) : (
        <div className="text-center">Loading...</div>
      )}
      <Dialog
        modal={false}
        open={newChatDialogOpen}
        onOpenChange={setNewChatDialogOpen}
      >
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="absolute bottom-[8%] right-[5%] w-[60px] h-[60px] bg-blue-500/80 rounded-full flex items-center justify-center cursor-pointer">
            <BsPencil size={34} color="white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={handleCreateGroupChat}>
                New group
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={handleNewMessage}>
                New message
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <NewChatDialog
            chatType={chatType}
            onFinish={() => {
              setNewChatDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatsTab;
