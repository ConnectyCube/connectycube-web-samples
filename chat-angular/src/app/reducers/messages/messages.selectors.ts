import {createFeatureSelector, createSelector} from "@ngrx/store";
import {messagesAdapter, messagesState} from "./messages.reducer";
import {MESSAGES_KEY} from "../index";
import {getDialogMessages, getUnreadMessageIds} from "../dialog/dialog.selectors";
import {rxSubscriber} from "rxjs/internal-compatibility";

export const featureSelector = createFeatureSelector<messagesState>(MESSAGES_KEY)

export const messagesSelector = messagesAdapter.getSelectors();

export const getMessageEntities = createSelector(featureSelector, messagesSelector.selectEntities);
export const getMessageIds = createSelector(featureSelector, messagesSelector.selectIds);

export const getMessagesSelector = createSelector(
  getMessageEntities,
  getDialogMessages,
  (messages: any, msgIds: any) => {
    if (msgIds) {
      return msgIds.length !== 0 ? msgIds.map((id: string) => messages[id]) : [];
    }
    return [];
  }
)

export const getUnreadMessageList = (dialogId: string) =>
  createSelector(
    getMessageEntities,
    getUnreadMessageIds({dialogId}),
    (messages: any, msgIds: any) => {
      return msgIds?.map((id: string) => messages[id]);
    }
  )

export const getMessageHeight = createSelector(
  getMessageEntities,
  (messages: any, {msgId}: any) => {
    return messages[msgId]?.height;
  }
)
