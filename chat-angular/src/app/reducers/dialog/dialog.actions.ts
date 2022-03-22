import {createAction, props} from "@ngrx/store";
import {Dialog} from "../../services/config";
import {participant} from "../participants/participants.reducer";

export const addDialogs = createAction(
  '[DIALOG] add dialogs',
  props<{ dialogs: Array<Dialog> }>()
)

export const addDialog = createAction(
  '[DIALOG] add dialog',
  props<{ dialog: Dialog }>()
)

export const removeDialog = createAction(
  '[DIALOG] remove dialog',
  props<{ id: string }>()
)

export const openDialog = createAction(
  '[DIALOG] open dialog',
  props<{ dialogId: string, isActivated: boolean }>()
)

export const addMessageId = createAction(
  '[DIALOG] add dialog`s message id',
  props<{ dialogId: string, msgIds: Array<string> }>()
)

export const updateMessageId = createAction(
  '[DIALOG] update dialog`s message id',
  props<{ dialogId: string, currentMsgIds: string, newMsgIds: string }>()
)

export const addMessagesIds = createAction(
  '[DIALOG] add dialog`s messages ids and participants',
  props<{ dialogId: string, msgIds: Array<string> }>()
)

export const addTypingParticipant = createAction(
  '[DIALOG] add typing participant to dialog',
  props<{ dialogId: string, participant: participant }>()
);

export const removeTypingParticipant = createAction(
  '[DIALOG] remove typing participant from dialog',
  props<{ dialogId: string, pId: number }>()
)

export const setNullConverastion = createAction(
  '[DIALOG] set null conversation'
)

export const readDialogAllMessages = createAction(
  '[DIALOG] read dialog`s all messages',
  props<{ dialogId: string }>()
)

export const addOneUnreadMessage = createAction(
  '[DIALOG] add one unread message',
  props<{ dialogId: string }>()
)

export const updateDialogLastMessage = createAction(
  '[DIALOG] update dialog last message',
  props<{ dialogId: string, lastMessage: string, lastMessageDate: number, lastMessageUserId: number }>()
)

export const updateDialogParticipant = createAction(
  '[DIALOG] update dialog participant',
  props<{ dialogId: string, userId: number }>()
)

export const updateDialogParticipants = createAction(
  '[DIALOG] update dialog participants',
  props<{ dialogId: string, userIds: Array<number> }>()
)

export const addDialogParticipants = createAction(
  '[DIALOG] add dialog participants',
  props<{ dialogId: string, userIds: Array<number> }>()
)
