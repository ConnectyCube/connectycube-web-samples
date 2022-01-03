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

export const INTERFACE_KEY = 'interface'
export const DIALOG_KEY = 'dialog'

export interface State {
  [INTERFACE_KEY]: interfaceState
  [DIALOG_KEY]: dialogState
}

export const reducers: ActionReducerMap<State> = {
  [INTERFACE_KEY]: interfaceReducer,
  [DIALOG_KEY]: dialogReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
