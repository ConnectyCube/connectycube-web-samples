import {createFeatureSelector, createSelector} from "@ngrx/store";
import {DIALOG_KEY} from "./index";
import {dialogState} from "./dialog.reducer";
import {Dialog} from "../services/config";

export const featureSelector =
  createFeatureSelector<dialogState>(DIALOG_KEY);

export const dialogsSelector = createSelector(
  featureSelector,
  state => state.dialogObject.dialogs
)

export const dialogsSearchSelector = createSelector(
  featureSelector,
  (state: dialogState, {data}: any) => {
    return state.dialogObject.dialogs.filter((dialog: Dialog) => dialog.name.toLowerCase().includes(data));
  }
)
