import {createAction, props} from "@ngrx/store";
import {participant} from "./participants.reducer";

export  const addParticipant = createAction(
  '[PARTICIPANT] add participant',
  props<participant>()
);

export const deleteParticipant = createAction(
  '[PARTICIPANT] delete participant',
  props<{id:number}>()
)

export const addListParticipants = createAction(
  '[PARTICIPANT] add list participant',
  props<{participantArray:Array<participant>}>()
)
