import {createAction, props} from "@ngrx/store";
import {participant} from "./participants.reducer";

export const addMeParticipant = createAction(
  '[PARTICIPANT] add me participant',
  props<participant>()
);

export const removeSelectedParticipant = createAction(
  '[PARTICIPANT] remove selected participant',
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

// participants adapter action

export const addParticipants = createAction(
  '[PARTICIPANT/ENTITY] add participants',
  props<{ participants: Array<participant> }>()
)
