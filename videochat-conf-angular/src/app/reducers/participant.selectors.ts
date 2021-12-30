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
    const newState = [...state].sort((user1: User, user2: User) => {
      if (user1.volumeLevel === undefined || user2.volumeLevel === undefined) {
        return -1;
      }
      else {
        return user2.volumeLevel - user1.volumeLevel;
      }
    })
    const deleteIndexSpeaker = newState.indexOf(<User>newState.find((user: User) => user.isActiveSpeaker));
    const deleteIndexOur = newState.indexOf(<User>newState.find((user: User) => user.me));
    const deleteUserOur = newState.splice(deleteIndexOur, 1);

    if (deleteIndexSpeaker !== -1) {
      const deleteUserSpeaker = newState.splice(deleteIndexSpeaker, 1);
      console.warn("DELETE USER", deleteUserSpeaker);
      return [...deleteUserSpeaker, ...deleteUserOur, ...newState];
    }
    else {
      return [newState[0], ...deleteUserOur, ...newState];
    }
  }
)
export const findParticipantSelector = createSelector(
  featureSelector,
  (state: any, props: any) => state.participantArray.find((user: User) => user.id === props.userId)
)
