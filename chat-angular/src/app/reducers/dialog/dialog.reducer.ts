import {Dialog} from "../../services/config";
import {createReducer, on} from "@ngrx/store";
import {addDialog, addDialogs, addMessageId, addMessagesIdsAndParticipants, openDialog} from "./dialog.actions";
import {addMessage} from "../messages/messages.action";

export interface dialogState {
  selectedConversation: string,
  activatedConversation: Array<string>,
  dialogs: Array<Dialog>
}

export const initialState: dialogState = {
  selectedConversation: "",
  activatedConversation: [],
  dialogs: []
}

export const dialogReducer = createReducer(
  initialState,
  on(addDialogs, (state, {dialogs}) => ({
    ...state,
    dialogs: dialogs
  })),
  on(addDialog, (state, {dialog}) => ({
    ...state,
    dialogs: [...[dialog], ...state.dialogs]
  })),
  on(openDialog, (state, {dialogId, isActivated}) => ({
    ...state,
    selectedConversation: dialogId,
    activatedConversation: isActivated ? state.activatedConversation
      : [...state.activatedConversation, ...[dialogId]]
  })),
  on(addMessageId, (state, {dialogId, msgIds}) => ({
    ...state,
    dialogs: state.dialogs.map((d: Dialog) => {
      if (d.id === dialogId) {
        msgIds = [...msgIds,...d.msgIds];
        return {...d, msgIds};
      }
      return d;
    })
  })),
  on(addMessagesIdsAndParticipants, (state, {dialogId, msgIds, participants}) => ({
    ...state,
    dialogs: state.dialogs.map((d: Dialog) => {
      if (d.id === dialogId) {
        console.warn(participants)
        return {...d, msgIds, participants};
      }
      return d;
    })
  }))
)
