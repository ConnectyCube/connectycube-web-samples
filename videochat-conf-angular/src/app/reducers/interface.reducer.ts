import {createReducer, on} from '@ngrx/store';
import {addAudioPermission, addVideoPermission} from "./interface.actions";

export interface interfaceState {
  interfaceObject: {
    audioPermission?: boolean,
    videoPermission?: boolean,
    audioConnect?: boolean,
    videoConnect?: boolean,
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
)
