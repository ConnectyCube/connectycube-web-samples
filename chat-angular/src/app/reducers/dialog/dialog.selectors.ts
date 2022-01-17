import {createFeatureSelector, createSelector} from "@ngrx/store";
import {DIALOG_KEY} from "../index";
import {dialogState} from "./dialog.reducer";
import {Dialog} from "../../services/config";

export const featureSelector =
  createFeatureSelector<dialogState>(DIALOG_KEY);

export const dialogsSelector = createSelector(
  featureSelector,
  state => state.dialogs
)

export const dialogsSearchSelector = createSelector(
  featureSelector,
  (state: dialogState, {data}: any) => {
    return state.dialogs.filter((dialog: Dialog) => dialog.name.toLowerCase().includes(data));
  }
)

export const selectedConversationSelector = createSelector(
  featureSelector,
  state => state.selectedConversation
)

export const isActivatedConversationSelector = createSelector(
  featureSelector,
  (state: dialogState, {id}: any) => state.activatedConversation.some((c: string) => c === id)
)

export const dialogFindSelector = createSelector(
  featureSelector,
  (state: dialogState, {id}: any) => {
    return state.dialogs.find((dialog: Dialog) => dialog.id === id);
  }
)

export const getDialogMessages = createSelector(
  featureSelector,
  (state: dialogState) => {
    const dialog = state.dialogs.find((d: Dialog) => d.id === state.selectedConversation)
    return dialog?.msgIds
  }
)

export const getDialogParticipant = createSelector(
  featureSelector,
  (state: dialogState, {dialogId, pId}: any) => {
    const dialog = state.dialogs.find((d: Dialog) => d.id === dialogId);
    return dialog?.participants.get(String(pId));
  }
)
