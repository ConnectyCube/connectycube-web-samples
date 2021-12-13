import {createFeatureSelector, createSelector} from "@ngrx/store";
import {interfaceState} from "./interface.reducer";
import {INTERFACE_KEY} from "./index";

export const featureSelector =
  createFeatureSelector<interfaceState>(INTERFACE_KEY);
export const interfaceSelector = createSelector(
  featureSelector,
  state => state.interfaceObject
)
export const chatStatusSelector = createSelector(
  interfaceSelector,
  state => state.chatOpenStatus
)
export const controlButtonsStatusSelector = createSelector(
  interfaceSelector,
  state => state.controlButtonsStatus
)
export const switchVideoStatusSelector = createSelector(
  interfaceSelector,
  state => state.switchVideoStatus
)
export const showRecordButtonStatusSelector = createSelector(
  interfaceSelector,
  state => state.showRecordButtonStatus
)
export const isRecordingSelector = createSelector(
  interfaceSelector,
  state => state.isRecording
)
