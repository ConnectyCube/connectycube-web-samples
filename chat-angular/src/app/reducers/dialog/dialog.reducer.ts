import {Dialog} from "../../services/config";
import {createReducer, on} from "@ngrx/store";
import {
  addDialog,
  addDialogs,
  addMessageId,
  addMessagesIds,
  addTypingParticipant,
  openDialog,
  readDialogAllMessages,
  addOneUnreadMessage,
  removeTypingParticipant,
  setNullConverastion,
  updateDialogLastMessage, updateMessageId, removeDialog, updateDialogParticipants, addDialogParticipants
} from "./dialog.actions";
import {createEntityAdapter, EntityState} from "@ngrx/entity";

//Entity Adapter
export interface dialogState extends EntityState<Dialog> {
  selectedConversation: string,
  activatedConversation: Array<string>,
}

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
      return dialogsAdapter.setOne(dialog, state);
    }),
    on(removeDialog, (state, {id}) => {
      return dialogsAdapter.removeOne(id,
        {
          ...state,
          activatedConversation: state.activatedConversation.filter((dialogId: string) => dialogId !== id)
        });
    }),
    on(updateDialogParticipants, (state, {dialogId, userId}) => {
      return dialogsAdapter.updateOne({
        id: dialogId,
        changes: {participantIds: state.entities[dialogId]?.participantIds.filter((id: number) => id !== userId)}
      }, state)
    }),
    on(addDialogParticipants, (state, {dialogId, userIds}) => {
      const participantsIds = state.entities[dialogId]?.participantIds || [];
      return dialogsAdapter.updateOne({
          id: dialogId,
          changes: {
            participantIds: [...participantsIds, ...userIds]
          }
        },
        state
      )
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
    on(updateMessageId, (state, {dialogId, currentMsgIds, newMsgIds}) => {
      return dialogsAdapter.updateOne({
        id: dialogId,
        changes: {msgIds: state.entities[dialogId]!.msgIds.map((id: string) => id === currentMsgIds ? newMsgIds : id)}
      }, state)
    }),
    on(addMessagesIds, (state, {dialogId, msgIds}) => {
      return dialogsAdapter.updateOne({
        id: dialogId,
        changes: {msgIds}
      }, state)
    }),
    on(addTypingParticipant, (state, {dialogId, participant}) => {
      if (participant) {
        return dialogsAdapter.updateOne({
          id: dialogId,
          changes: {
            typingParticipants:
              [...state.entities[dialogId]!.typingParticipants, ...[{
                id: participant.id,
                name: participant.full_name
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
    on(updateDialogLastMessage, (state, {dialogId, lastMessage, lastMessageDate, lastMessageUserId}) => {
      console.warn(lastMessage)
      return dialogsAdapter.updateOne({
        id: dialogId,
        changes: {
          lastMessage,
          lastMessageDate,
          lastMessageUserId
        }
      }, state)
    })
  )
;
