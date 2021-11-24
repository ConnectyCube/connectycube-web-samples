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
  state => [...state].sort((user1: User, user2: User) => {
    if (user1.volumeLevel === undefined || user2.volumeLevel === undefined) {
      return -1;
    }
    else {
      return user2.volumeLevel - user1.volumeLevel;
    }
  })
)
