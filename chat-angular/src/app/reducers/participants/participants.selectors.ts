import {createFeatureSelector, createSelector} from "@ngrx/store";
import {participant, participantAdapter, participantsState} from "./participants.reducer";
import {PARTICIPANT_KEY} from "../index";

export const featureSelector =
  createFeatureSelector<participantsState>(PARTICIPANT_KEY)

export const participantSelector = participantAdapter.getSelectors();

export const getParticipantsEntities = createSelector(featureSelector, participantSelector.selectEntities);
export const getParticipantsIds = createSelector(featureSelector, participantSelector.selectIds);

export const getLastMessageParticipantName = createSelector(
  getParticipantsEntities,
  (participants: any, {participantId}: any) => {
    if (participants[participantId]) {
      return participants[participantId].me ? "You" : participants[participantId].full_name;
    }
    return "";
  }
)

export const meSelector = createSelector(
  featureSelector,
  state => state.selectedParticipants.find((p: participant) => p.me)
)

export const selectedParticipantsSelector = createSelector(
  featureSelector,
  state => state.selectedParticipants
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
