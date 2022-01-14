import {createReducer, on} from "@ngrx/store";
import {
  addParticipant,
  addSearchParticipants, addSelectedParticipants,
  removeParticipant, removeAllSearchParticipants,
  selectParticipant,
  unSelectParticipant, removeAllSelectedParticipants
} from "./participants.actions";

export interface participant {
  id: number,
  full_name: string,
  login: string,
  avatar: string | null,
  me: boolean,
  active?: boolean
}

export interface participantsState {
  participantsArray: Array<participant>,
  searchedParticipants: Array<participant>
}

export const initialState: participantsState = {
  participantsArray: [],
  searchedParticipants: []
}

export const participantsReducer = createReducer(
  initialState,
  on(addParticipant, (state, {id, full_name, login, avatar, me}) => ({
    ...state,
    participantsArray: [...state.participantsArray, ...[{id, full_name, login, avatar, me}]]
  })),
  on(removeParticipant, (state, {id}) => ({
    ...state,
    participantsArray: state.participantsArray.filter((p: participant) => p.id !== id)
  })),
  on(addSelectedParticipants, (state, {selectedParticipant}) => ({
    ...state,
    participantsArray: selectedParticipant
  })),
  on(addSearchParticipants, (state, {participantArray}) => ({
    ...state,
    searchedParticipants: participantArray
  })),
  on(selectParticipant, (state, {id}) => ({
    ...state,
    searchedParticipants: state.searchedParticipants.filter((p: participant) => p.id !== id),
  })),
  on(unSelectParticipant, (state, {p}) => ({
    ...state,
    searchedParticipants: [...state.searchedParticipants, ...[p]]
  })),
  on(removeAllSearchParticipants, (state) => ({
    ...state,
    searchedParticipants: []
  })),
  on(removeAllSelectedParticipants, (state) => ({
    ...state,
    participantsArray: state.participantsArray.filter((p: participant) => p.me)
  })),
)
