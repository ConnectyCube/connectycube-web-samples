import {createAction, props} from "@ngrx/store";

export const toggleCreatChatStatus = createAction(
  '[INTERFACE] toggle creat chat status',
  props<{isChatCreator:boolean}>()
)
