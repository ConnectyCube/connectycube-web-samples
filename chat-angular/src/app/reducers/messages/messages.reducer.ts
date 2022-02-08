import {Message} from "../../services/config";
import {createEntityAdapter, EntityState, Update} from "@ngrx/entity";
import {createReducer, on} from "@ngrx/store";
import {
  addMessage,
  addMessages,
  updateMessagePhoto, updateMessageSendersName, updateMessagesStatus,
  updateMessageStatus,
  updateMessageWidthHeight
} from "./messages.action";

export interface messagesState extends EntityState<Message> {
}

export function selectMessageId(m: Message): string {
  return m.id;
}

export function sortByDateSent(m1: Message, m2: Message): number {
  return m2.date_sent - m1.date_sent;
}

export const messagesAdapter = createEntityAdapter<Message>({
  selectId: selectMessageId,
  sortComparer: sortByDateSent
});

export const initialState: messagesState = messagesAdapter.getInitialState();

export const messagesReducer = createReducer(
  initialState,
  on(addMessage, (state, {message}) => {
    return messagesAdapter.addOne(message, state);
  }),
  on(addMessages, (state, {messages}) => {
    return messagesAdapter.addMany(messages, state);
  }),
  on(updateMessageStatus, (state, {msgId, status}) => {
    return messagesAdapter.updateOne({
      id: msgId,
      changes: {status}
    }, state)
  }),
  on(updateMessagesStatus, (state, {msgIds, status}) => {
    return messagesAdapter.updateMany(msgIds.map((id: string) => {
      return {
        id,
        changes: {status}
      }
    }), state)
  }),
  on(updateMessagePhoto, (state, {msgId, photo, id}) => {
    return messagesAdapter.updateOne({
      id: msgId,
      changes: {photo, id}
    }, state)
  }),
  on(updateMessageWidthHeight, (state, {msgId, width, height}) => {
    return messagesAdapter.updateOne({
      id: msgId,
      changes: {width, height}
    }, state)
  }),
  on(updateMessageSendersName, (state, {updates}) => {
    return messagesAdapter.updateMany(updates, state);
  })
);
