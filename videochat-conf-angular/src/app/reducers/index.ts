import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {DEFAULT_ROUTER_FEATURENAME, routerReducer, RouterReducerState} from "@ngrx/router-store";
import {participantReducer, participantState} from "./participant.reducer";

export const PARTICIPANT_KEY = 'participant';

export interface State {
  [DEFAULT_ROUTER_FEATURENAME]:RouterReducerState;
  [PARTICIPANT_KEY]:participantState;
}

export const reducers: ActionReducerMap<State> = {
  [DEFAULT_ROUTER_FEATURENAME]:routerReducer,
  [PARTICIPANT_KEY]: participantReducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];