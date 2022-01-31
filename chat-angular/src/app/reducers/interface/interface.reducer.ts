import {createReducer, on} from "@ngrx/store";
import {chatConnected} from "./interface.actions";

export interface interfaceState {
  interfaceObject: {
    isChatConnected: boolean
  }
}

export const initialState: interfaceState = {
  interfaceObject: {
    isChatConnected: false
  }
}

export const interfaceReducer = createReducer(
  initialState,
  on(chatConnected, (state) => ({
    ...state,
    interfaceObject: {...state.interfaceObject, isChatConnected: true}
  }))
)
