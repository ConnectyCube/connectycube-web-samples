import React, { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Users } from "node_modules/connectycube/dist/types/types";
import { Button } from "@/components/shadcn-ui/button";
import Participant from "./Participant";
import groupChatImage from "../../../../../assets/group-chat.jpg";
import "./CreateGroupChat.scss";

export interface CreateGroupChatProps {
  users: Users.User[];
  onCreateChat: (name: string) => void;
}

type FormValues = {
  name: string;
};

const CreateGroupChat: React.FC<CreateGroupChatProps> = ({
  users,
  onCreateChat,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const participants = useMemo(() => {
    return users.map((user) => {
      return (
        <Participant
          key={user.id}
          name={user.login || user.full_name}
          avatar={user.avatar}
        />
      );
    });
  }, [users]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    onCreateChat(data.name);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="new-chat__form create">
      <div className="chat__img">
        <img src={groupChatImage} alt="" />
      </div>
      <input
        className="chat__name"
        type="text"
        placeholder="Chat name"
        {...register("name", {
          required: "Chat name is required",
        })}
      />
      {errors.name && <span className="error">{errors.name.message}</span>}
      <div className="users__in-group">{participants}</div>
      <div className="text-center">
        <Button type="submit" className="px-3 mt-4">
          Create group chat
        </Button>
      </div>
    </form>
  );
};

export default React.memo(CreateGroupChat);
