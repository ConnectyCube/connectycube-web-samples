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

export const openDialog = createAction(
  '[DIALOG] open dialog',
  props<{ dialogId: string, isActivated: boolean }>()
)

export const addMessageId = createAction(
  '[DIALOG] add dialog`s message id',
  props<{ dialogId: string, msgIds: Array<string> }>()
)

export const addMessagesIdsAndParticipants = createAction(
  '[DIALOG] add dialog`s messages ids and participants',
  props<{ dialogId: string, msgIds: Array<string>, participants: Map<string, participant> }>()
)

export const addTypingParticipant = createAction(
  '[DIALOG] add typing participant to dialog',
  props<{ dialogId: string, pId: number }>()
);

export const removeTypingParticipant = createAction(
  '[DIALOG] remove typing participant from dialog',
  props<{dialogId: string, pId: number}>()
)

export const setNullConverastion = createAction(
  '[DIALOG] set null conversation'
)
