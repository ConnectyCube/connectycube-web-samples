import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {interfaceReducer, interfaceState} from "./interface/interface.reducer";
import {dialogReducer, dialogState} from "./dialog/dialog.reducer";
import {participantsReducer, participantsState} from "./participants/participants.reducer";
import {logout} from "./metaReducer";
import {DEFAULT_ROUTER_FEATURENAME, routerReducer, RouterReducerState} from "@ngrx/router-store";
import {messagesReducer, messagesState} from "./messages/messages.reducer";

export const INTERFACE_KEY = 'interface'
export const DIALOG_KEY = 'dialog'
export const PARTICIPANT_KEY = 'participant'
export const MESSAGES_KEY = 'messages'

export interface State {
  [DEFAULT_ROUTER_FEATURENAME]: RouterReducerState
  [INTERFACE_KEY]: interfaceState
  [DIALOG_KEY]: dialogState
  [PARTICIPANT_KEY]: participantsState
  [MESSAGES_KEY]: messagesState
}

export const reducers: ActionReducerMap<State> = {
  [DEFAULT_ROUTER_FEATURENAME]: routerReducer,
  [INTERFACE_KEY]: interfaceReducer,
  [DIALOG_KEY]: dialogReducer,
  [PARTICIPANT_KEY]: participantsReducer,
  [MESSAGES_KEY]: messagesReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [logout] : [logout];
