import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {DEFAULT_ROUTER_FEATURENAME, routerReducer, RouterReducerState} from "@ngrx/router-store";
import {participantReducer, participantState} from "./participant.reducer";
import {interfaceReducer, interfaceState} from "./interface.reducer";
import {dialogReducer, dialogState} from "./dialog.reducer";

export const PARTICIPANT_KEY = 'participant';
export const INTERFACE_KEY = 'interface';
export const DIALOG_KEY = 'dialog';

export interface State {
  [DEFAULT_ROUTER_FEATURENAME]: RouterReducerState;
  [PARTICIPANT_KEY]: participantState;
  [INTERFACE_KEY]: interfaceState;
  [DIALOG_KEY]: dialogState
}

export const reducers: ActionReducerMap<State> = {
  [DEFAULT_ROUTER_FEATURENAME]: routerReducer,
  [PARTICIPANT_KEY]: participantReducer,
  [INTERFACE_KEY]: interfaceReducer,
  [DIALOG_KEY]: dialogReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
