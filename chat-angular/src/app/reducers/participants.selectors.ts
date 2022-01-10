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
