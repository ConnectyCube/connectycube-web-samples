import React, { useMemo } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import Participant from "./Participant/Participant";
import groupChatImage from "../../../../../assets/group-chat.jpg";
import "./CreateGroupChat.scss";

export interface CreateGroupChatProps {
  onClose: () => void;
  users: Users.User[];
  onCreateChat: (name: string) => void;
}

type FormValues = {
  name: string;
};

const CreateGroupChat: React.FC<CreateGroupChatProps> = ({
  onClose,
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
      <div className="close__btn" onClick={onClose}>
        <AiOutlineClose color="black" fontSize="1.5em" />
      </div>
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
      <button className="create__group-btn" type="submit">
        Create group chat
      </button>
    </form>
  );
};

export default React.memo(CreateGroupChat);
