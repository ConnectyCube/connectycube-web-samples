import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {interfaceReducer, interfaceState} from "./interface.reducer";

export const INTERFACE_KEY = 'interface'

export interface State {
  [INTERFACE_KEY]: interfaceState
}

export const reducers: ActionReducerMap<State> = {
  [INTERFACE_KEY]: interfaceReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
