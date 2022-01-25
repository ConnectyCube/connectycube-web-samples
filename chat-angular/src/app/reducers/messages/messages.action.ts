import {createAction, props} from "@ngrx/store";
import {Message} from "../../services/config";

export const addMessages = createAction(
  '[MESSAGES] add array messages',
  props<{ messages: Array<Message> }>()
)

export const addMessage = createAction(
  '[MESSAGES] add message',
  props<{ message: Message }>()
)

export const updateMessageStatus = createAction(
  '[MESSAGES] update message status',
  props<{ msgId: string, status:string }>()
)
