import {createReducer, on} from "@ngrx/store";
import {addMessages, setActiveDialogId, addMessage, removeAllMessages} from "./dialog.actions";
import {concat} from "rxjs";
import {SafeHtml} from "@angular/platform-browser";

export interface dialogState {
  dialog: {
    dialogId: string,
    dialogMessages: Array<Message>
  }
}

export interface Message {
  senderName?: string,
  body: string | null,
  time: string,
  statusUndefined?: boolean,
}

export const initialState: dialogState = {
  dialog: {
    dialogId: '',
    dialogMessages: []
  }
}

export const dialogReducer = createReducer(
  initialState,
  on(setActiveDialogId, (state, {dialogId}) => ({
    ...state,
    dialog: {...state.dialog, dialogId}
  })),
  on(addMessage, (state, {senderName, body, time}) => ({
    ...state,
    dialog: {
      dialogId: state.dialog.dialogId,
      dialogMessages: state.dialog.dialogMessages.concat([{senderName, body, time}])
    }
  })),
  on(addMessages, (state, {dialogMessages}) => ({
    ...state,
    dialog: {
      dialogId: state.dialog.dialogId,
      dialogMessages: dialogMessages
    }
  })),
  on(removeAllMessages, (state) => ({
    ...state,
    dialog: {dialogId: "", dialogMessages: []}
  }))
)
