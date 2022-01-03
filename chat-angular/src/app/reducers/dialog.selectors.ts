import {createFeatureSelector, createSelector} from "@ngrx/store";
import {DIALOG_KEY} from "./index";
import {dialogState} from "./dialog.reducer";

export const featureSelector =
  createFeatureSelector<dialogState>(DIALOG_KEY);

export const dialogsSelector = createSelector(
  featureSelector,
  state => state.dialogObject.dialogs
)
