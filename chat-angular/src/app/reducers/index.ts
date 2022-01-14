import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {interfaceReducer, interfaceState} from "./interface.reducer";
import {dialogReducer, dialogState} from "./dialog.reducer";
import {participantsReducer, participantsState} from "./participants.reducer";
import {logout} from "./metaReducer";

export const INTERFACE_KEY = 'interface'
export const DIALOG_KEY = 'dialog'
export const PARTICIPANT_KEY = 'participant'

export interface State {
  [INTERFACE_KEY]: interfaceState
  [DIALOG_KEY]: dialogState
  [PARTICIPANT_KEY]: participantsState
}

export const reducers: ActionReducerMap<State> = {
  [INTERFACE_KEY]: interfaceReducer,
  [DIALOG_KEY]: dialogReducer,
  [PARTICIPANT_KEY]: participantsReducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [logout] : [logout];
