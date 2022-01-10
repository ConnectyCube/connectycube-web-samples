import {createReducer, on} from "@ngrx/store";
import {addParticipant, deleteParticipant} from "./participants.actions";

export interface participant {
  id: number,
  full_name: string,
  login: string,
  avatar: string | null,
  me: boolean,
}

export interface participantsState {
  participantsArray: Array<participant>
}

export const initialState: participantsState = {
  participantsArray: []
}

export const participantsReducer = createReducer(
  initialState,
  on(addParticipant, (state, {id, full_name, login, avatar, me}) => ({
    ...state,
    participantsArray: [...state.participantsArray, ...[{id, full_name, login, avatar, me}]]
  })),
  on(deleteParticipant, (state, {id}) => ({
    ...state,
    participantsArray: state.participantsArray.filter((p: participant) => p.id !== id)
  }))
)
