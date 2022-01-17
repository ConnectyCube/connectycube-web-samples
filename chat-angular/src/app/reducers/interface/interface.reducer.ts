import {createReducer, on} from "@ngrx/store";
import {toggleCreatChatStatus} from "./interface.actions";

export interface interfaceState{
  interfaceObject: {
    isChatCreator?: boolean
  }
}

export const initialState: interfaceState = {
  interfaceObject: {}
}

export const interfaceReducer = createReducer(
  initialState,
  on(toggleCreatChatStatus, (state, {isChatCreator})=>({
    ...state,
    interfaceObject: {...state.interfaceObject, isChatCreator}
  }))
)
