import {createFeatureSelector, createSelector} from "@ngrx/store";
import {participant, participantsState} from "./participants.reducer";
import {PARTICIPANT_KEY} from "./index";

export const featureSelector =
  createFeatureSelector<participantsState>(PARTICIPANT_KEY)

export const meSelector = createSelector(
  featureSelector,
  state => state.participantsArray.find((p: participant) => p.me)
)

export const participantSelector = createSelector(
  featureSelector,
  state => state.participantsArray
)

export const searchedParticipantSelector = createSelector(
  featureSelector,
  state => [...state.searchedParticipants].sort((p1: participant, p2: participant) => {
    if (p1.full_name < p2.full_name) {
      return -1;
    }
    if (p1.full_name > p2.full_name) {
      return 1;
    }
    return 0;
  })
)
