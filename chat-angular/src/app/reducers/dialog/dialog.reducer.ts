import {Dialog, Message} from "../../services/config";
import {createReducer, on} from "@ngrx/store";
import {
  addDialog,
  addDialogs,
  addMessageId,
  addMessagesIdsAndParticipants,
  addTypingParticipant,
  openDialog,
  readDialogAllMessages,
  addOneUnreadMessage,
  removeTypingParticipant,
  setNullConverastion,
  updateDialogLastMessage, updateDialogParticipants, updateParticipantLastActivity
} from "./dialog.actions";
import {createEntityAdapter, EntityState} from "@ngrx/entity";

//Entity Adapter
export interface dialogState extends EntityState<Dialog> {
  selectedConversation: string,
  activatedConversation: Array<string>,
};

export function selectDialogId(d: Dialog): string {
  return d.id;
}

export function sortByDateCreate(d1: Dialog, d2: Dialog): number {
  const date1 = d1.lastMessageDate ? d1.lastMessageDate : Math.floor(new Date(d1.createAt).getTime() / 1000);
  const date2 = d2.lastMessageDate ? d2.lastMessageDate : Math.floor(new Date(d2.createAt).getTime() / 1000);
  return date2 - date1;
}

export const dialogsAdapter = createEntityAdapter<Dialog>({
  selectId: selectDialogId,
  sortComparer: sortByDateCreate
})

export const initialState: dialogState = dialogsAdapter.getInitialState({
  selectedConversation: "",
  activatedConversation: [],
})

export const dialogReducer = createReducer(
  initialState,
  on(addDialogs, (state, {dialogs}) => {
    return dialogsAdapter.setAll(dialogs, state);
  }),
  on(addDialog, (state, {dialog}) => {
    return dialogsAdapter.addOne(dialog, state);
  }),
  on(openDialog, (state, {dialogId, isActivated}) => ({
    ...state,
    selectedConversation: dialogId,
    activatedConversation: isActivated ? state.activatedConversation
      : [...state.activatedConversation, ...[dialogId]]
  })),
  on(addMessageId, (state, {dialogId, msgIds}) => {
    return dialogsAdapter.updateOne({
      id: dialogId,
      changes: {msgIds: [...msgIds, ...state.entities[dialogId]!.msgIds]}
    }, state)
  }),
  on(addMessagesIdsAndParticipants, (state, {dialogId, msgIds, participants}) => {
    return dialogsAdapter.updateOne({
      id: dialogId,
      changes: {msgIds, participants}
    }, state)
  }),
  on(addTypingParticipant, (state, {dialogId, pId}) => {
    if (state.entities[dialogId]!.participants.has(String(pId))) {
      return dialogsAdapter.updateOne({
        id: dialogId,
        changes: {
          typingParticipants:
            [...state.entities[dialogId]!.typingParticipants, ...[{
              id: pId,
              name: state.entities[dialogId]!.participants.get(String(pId))!.full_name
            }]]
        }
      }, state)
    }
    return state;
  }),
  on(removeTypingParticipant, (state, {dialogId, pId}) => {
    return dialogsAdapter.updateOne({
      id: dialogId,
      changes: {
        typingParticipants: state.entities[dialogId]!.typingParticipants.filter((p: any) => p.id !== pId)
      }
    }, state)
  }),
  on(setNullConverastion, (state) => ({
    ...state,
    selectedConversation: ""
  })),
  on(readDialogAllMessages, (state, {dialogId}) => {
    return dialogsAdapter.updateOne({
      id: dialogId,
      changes: {
        unreadMessage: 0
      }
    }, state)
  }),
  on(addOneUnreadMessage, (state, {dialogId}) => {
    if (state.selectedConversation !== dialogId) {
      return dialogsAdapter.updateOne({
        id: dialogId,
        changes: {
          unreadMessage: state.entities[dialogId]!.unreadMessage + 1,
        }
      }, state)
    }
    return state;
  }),
  on(updateDialogLastMessage, (state, {dialogId, lastMessage, lastMessageDate}) => {
    return dialogsAdapter.updateOne({
      id: dialogId,
      changes: {
        lastMessage,
        lastMessageDate
      }
    }, state)
  }),
  on(updateDialogParticipants, (state, {dialogId, participants}) => {
    return dialogsAdapter.updateOne({
      id: dialogId,
      changes: {
        participants
      }
    }, state)
  }),
  on(updateParticipantLastActivity, (state, {participantId, lastActivity}) => {
    const dialogId = state.selectedConversation;
    const participants = new Map(state.entities[dialogId]!.participants)
    const updateUser = participants.get(String(participantId));
    if (updateUser) {
      updateUser.lastActivity = lastActivity;
      participants.set(String(participantId), updateUser);
    }
    return dialogsAdapter.updateOne({
      id: dialogId,
      changes: {participants}
    }, state)
  })
);
