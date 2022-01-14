import {createAction, props} from "@ngrx/store";
import {Dialog} from "../services/config";

export const addDialogs = createAction(
  '[DIALOG] add dialogs',
  props<{ dialogs: Array<Dialog> }>()
)

export const addDialog = createAction(
  '[DIALOG] add dialog',
  props<{dialog:Dialog}>()
)
