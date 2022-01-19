import {createFeatureSelector, createSelector} from "@ngrx/store";
import {DIALOG_KEY} from "../index";
import {dialogsAdapter, dialogState} from "./dialog.reducer";
import {Dialog} from "../../services/config";

export const featureSelector =
  createFeatureSelector<dialogState>(DIALOG_KEY);

export const dialogSelector = dialogsAdapter.getSelectors();

export const getDialogEntities = createSelector(featureSelector, dialogSelector.selectEntities);
export const getDialogIds = createSelector(featureSelector, dialogSelector.selectIds);

export const dialogsSelector = createSelector(
  getDialogEntities,
  getDialogIds,
  (dialog: any, dialogIds: any) => {
    return dialogIds.length !== 0 ? dialogIds.map((id: string) => dialog[id]) : [];
  }
)

export const dialogsSearchSelector = createSelector(
  getDialogEntities,
  getDialogIds,
  (dialogs: any, dialogIds: any, {data}: any) => {
    const searchIds = dialogIds.length !== 0 ? dialogIds.filter((id: string) => dialogs[id].name.toLowerCase().includes(data)) : [];
    return searchIds.map((id: string) => dialogs[id]);
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
  getDialogEntities,
  (dialogs: any, {id}: any) => {
    return dialogs[id];
  }
)

export const getDialogMessages = createSelector(
  getDialogEntities,
  selectedConversationSelector,
  (dialogs: any, selectedConverastion: string) => {
    if (selectedConverastion) {
      return dialogs[selectedConverastion].msgIds;
    }
  }
)

export const getDialogParticipant = createSelector(
  getDialogEntities,
  (dialogs: any, {dialogId, pId}: any) => {
    return dialogs[dialogId].participants.get(String(pId));
  }
)

export const getIndividualDialogByParticipantId = createSelector(
  getDialogEntities,
  getDialogIds,
  (dialogs: any, dialogIds: any, {pId}: any) => {
    return dialogIds.find((id: string) => dialogs[id].type === 3 && dialogs[id].participantIds.includes(pId));
  }
)

export const getDialogsTypingParticipant = createSelector(
  getDialogEntities,
  (dialogs: any, {dialogId}: any) => {
    return dialogs[dialogId].typingParticipants.map((p: any) => p.name);
  }
)
