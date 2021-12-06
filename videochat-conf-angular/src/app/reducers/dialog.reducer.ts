import {createReducer, on} from "@ngrx/store";
import {addDialogHistory, addDialogId, addMessage} from "./dialog.actions";
import {concat} from "rxjs";

export interface dialogState {
  dialog: {
    dialogId: string,
    dialogMessages: Array<Message>
  }
}

export interface Message {
  message_name?: string,
  message_text: string,
  message_time: string,
  statusUndefined?:boolean,
}

export const initialState: dialogState = {
  dialog: {
    dialogId: '',
    dialogMessages: []
  }
}

export const dialogReducer = createReducer(
  initialState,
  on(addDialogId, (state, {dialogId}) => ({
    ...state,
    dialog: {...state.dialog, dialogId}
  })),
  on(addMessage, (state, {message_name, message_text, message_time}) => ({
    ...state,
    dialog: {
      dialogId: state.dialog.dialogId,
      dialogMessages: state.dialog.dialogMessages.concat([{message_name, message_text, message_time}])
    }
  })),
  on(addDialogHistory, (state, {dialogMessages})=>({
    ...state,
    dialog: {
      dialogId: state.dialog.dialogId,
      dialogMessages: dialogMessages
    }
  }))
)
