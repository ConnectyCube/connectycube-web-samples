import {createReducer, on} from "@ngrx/store";
import {
  addMeParticipant,
  addSearchParticipants, addSelectedParticipants,
  removeSelectedParticipant, removeAllSearchParticipants,
  unSelectParticipant, removeAllSelectedParticipants, selectParticipant, addParticipants
} from "./participants.actions";
import {createEntityAdapter, EntityState} from "@ngrx/entity";

export interface participant {
  id: number,
  full_name: string,
  login: string,
  avatar: string | null,
  me: boolean,
  active?: boolean,
  lastActivity?: number
}

//Entity Adapter
export interface participantsState extends EntityState<participant> {
  selectedParticipants: Array<participant>,
  searchedParticipants: Array<participant>
}

export function selectParticipantId(p: participant) {
  return p.id;
}

export const participantAdapter = createEntityAdapter<participant>({
  selectId: selectParticipantId
})

export const initialState: participantsState = participantAdapter.getInitialState({
  selectedParticipants: [],
  searchedParticipants: []
})

export const participantsReducer = createReducer(
  initialState,
  on(addMeParticipant, (state, {id, full_name, login, avatar, me}) => ({
    ...state,
    selectedParticipants: [...state.selectedParticipants, ...[{id, full_name, login, avatar, me}]]
  })),
  on(removeSelectedParticipant, (state, {id}) => ({
    ...state,
    selectedParticipants: state.selectedParticipants.filter((p: participant) => p.id !== id)
  })),
  on(addSelectedParticipants, (state, {selectedParticipant}) => ({
    ...state,
    selectedParticipants: selectedParticipant
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
    selectedParticipants: state.selectedParticipants.filter((p: participant) => p.me)
  })),
  on(addParticipants, (state, {participants}) => {
    return participantAdapter.setMany(participants, state)
  })
)
