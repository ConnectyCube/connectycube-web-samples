import {Dialog} from "../services/config";
import {createReducer, on} from "@ngrx/store";
import {addDialogs} from "./dialog.actions";

export interface dialogState {
  dialogObject: {
    dialogs: Array<Dialog>
  }
}

export const initialState: dialogState = {
  dialogObject: {
    dialogs: []
  }
}

export const dialogReducer = createReducer(
  initialState,
  on(addDialogs, (state, {dialogs}) => ({
    ...state,
    dialogObject: {dialogs}
  }))
)
