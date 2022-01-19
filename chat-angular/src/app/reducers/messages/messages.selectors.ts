import {createFeatureSelector, createSelector} from "@ngrx/store";
import {messagesAdapter, messagesState} from "./messages.reducer";
import {MESSAGES_KEY} from "../index";
import {getDialogMessages} from "../dialog/dialog.selectors";

export const featureSelector = createFeatureSelector<messagesState>(MESSAGES_KEY)

export const messagesSelector = messagesAdapter.getSelectors();

export const getMessageEntities = createSelector(featureSelector, messagesSelector.selectEntities);
export const getMessageIds = createSelector(featureSelector, messagesSelector.selectIds);

export const getMessagesSelector = createSelector(
  getMessageEntities,
  getDialogMessages,
  (messages: any, msgIds: any) => {
    if(msgIds){
      return msgIds.length !== 0 ? msgIds.map((id: string) => messages[id]) : [];
    }
    return [];
  }
)
