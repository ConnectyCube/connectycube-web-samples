import {createFeatureSelector, createSelector} from "@ngrx/store";
import {dialogState} from "./dialog.reducer";
import {DIALOG_KEY} from "./index";

export const featureSelector =
  createFeatureSelector<dialogState>(DIALOG_KEY);

export const dialogIdSelector = createSelector(
  featureSelector,
  state => state.dialog.dialogId
);
export const dialogMessagesSelector = createSelector(
  featureSelector,
  state => state.dialog.dialogMessages
);
