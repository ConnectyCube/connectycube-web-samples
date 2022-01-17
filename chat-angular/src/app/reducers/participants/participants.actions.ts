import {createAction, props} from "@ngrx/store";
import {participant} from "./participants.reducer";

export const addParticipant = createAction(
  '[PARTICIPANT] add participant',
  props<participant>()
);

export const removeParticipant = createAction(
  '[PARTICIPANT] delete participant',
  props<{ id: number }>()
)

export const addSelectedParticipants = createAction(
  '[PARTICIPANT] add selected participants',
  props<{ selectedParticipant: Array<participant> }>()
)

export const removeAllSelectedParticipants = createAction(
  '[PARTICIPANT] remove all selected participants'
)

export const addSearchParticipants = createAction(
  '[PARTICIPANT] add searched participant',
  props<{ participantArray: Array<participant> }>()
)

export const removeAllSearchParticipants = createAction(
  '[PARTICIPANT] remove all searched participants'
)

export const selectParticipant = createAction(
  '[PARTICIPANT] select participant',
  props<{ id: number }>()
)

export const unSelectParticipant = createAction(
  '[PARTICIPANT] unselect participant',
  props<{ p: participant }>()
)
