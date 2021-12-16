import {createFeatureSelector, createSelector} from "@ngrx/store";
import {participantState, User} from "./participant.reducer";
import {PARTICIPANT_KEY} from "./index";

export const featureSelector
  = createFeatureSelector<participantState>(PARTICIPANT_KEY);
export const participantSelector = createSelector(
  featureSelector,
  state => state.participantArray
)
export const participantSortSelector = createSelector(
  participantSelector,
  state => {
    if([...state].some((user:User)=>user.volumeLevel !== 0)){
      return [...state].sort((user1: User, user2: User) => {
        if (user1.volumeLevel === undefined || user2.volumeLevel === undefined) {
          return -1;
        }
        else {
          return user2.volumeLevel - user1.volumeLevel;
        }
      })
    }
    else{
      return state;
    }
  }
)
export const findParticipantSelector = createSelector(
  featureSelector,
  (state: any, props: any) => state.participantArray.find((user: User) => user.id === props.userId)
)
