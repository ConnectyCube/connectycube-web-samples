import {createFeatureSelector, createSelector} from "@ngrx/store";
import {interfaceState} from "./interface.reducer";
import {INTERFACE_KEY} from "../index";

export const featureSelector =
  createFeatureSelector<interfaceState>(INTERFACE_KEY)
export const chatCreatorStatusSelector = createSelector(
  featureSelector,
  state => state.interfaceObject.isChatCreator
)
