import React, { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Users } from "node_modules/connectycube/dist/types/types";
import { Button } from "@/components/shadcn-ui/button";
import Participant from "./Participant";
import groupChatImage from "../../../../../assets/group-chat.jpg";

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
    <form onSubmit={handleSubmit(onSubmit)} className="pt-8">
      <div className="flex justify-center mb-6">
        <img
          src={groupChatImage}
          alt=""
          className="w-[220px] h-[150px] object-contain"
        />
      </div>
      <input
        className="w-full h-[50px] rounded-full border border-gray-300 mt-5 px-5 bg-white"
        type="text"
        placeholder="Chat name"
        {...register("name", {
          required: "Chat name is required",
        })}
      />
      {errors.name && (
        <span className="text-red-500 text-sm">{errors.name.message}</span>
      )}
      <div className="flex flex-wrap w-[90%] mx-auto pt-5 space-x-5">
        {participants}
      </div>
      <div className="text-center mt-4">
        <Button type="submit" className="px-3">
          Create group chat
        </Button>
      </div>
    </form>
  );
};

export default React.memo(CreateGroupChat);
