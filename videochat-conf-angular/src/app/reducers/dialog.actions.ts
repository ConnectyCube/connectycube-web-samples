import {createAction, props} from "@ngrx/store";
import {dialogState, Message} from "./dialog.reducer";

export const addDialogId = createAction(
  '[DIALOG] add dialog id',
  props<{ dialogId: string }>()
)
export const addMessage = createAction(
  '[DIALOG] add dialog message',
  props<Message>()
)
