import {createReducer, on} from '@ngrx/store';
import {
  addAudioPermission,
  addChatOpenStatus,
  addControlButtonsStatus,
  addSwitchVideoStatus,
  addVideoPermission
} from "./interface.actions";

export interface interfaceState {
  interfaceObject: {
    audioPermission?: boolean,
    videoPermission?: boolean,
    audioConnect?: boolean,
    videoConnect?: boolean,
    chatOpenStatus?: boolean,
    controlButtonsStatus?: boolean,
    switchVideoStatus?: boolean,
  }
}

export const initialState: interfaceState = {
  interfaceObject: {}
}

export const interfaceReducer = createReducer(
  initialState,
  on(addAudioPermission, (state, {audioPermission}) => ({
    ...state,
    interfaceObject: {...state.interfaceObject, audioPermission}
  })),
  on(addVideoPermission, (state, {videoPermission}) => ({
    ...state,
    interfaceObject: {...state.interfaceObject, videoPermission}
  })),
  on(addChatOpenStatus, (state, {chatOpenStatus}) => ({
    ...state,
    interfaceObject: {...state.interfaceObject, chatOpenStatus}
  })),
  on(addControlButtonsStatus, (state, {controlButtonsStatus}) => ({
    ...state,
    interfaceObject: {...state.interfaceObject, controlButtonsStatus}
  })),
  on(addSwitchVideoStatus, (state, {switchVideoStatus}) => ({
    ...state,
    interfaceObject: {...state.interfaceObject, switchVideoStatus}
  }))
)
