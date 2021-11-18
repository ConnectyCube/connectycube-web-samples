import {createAction, props} from '@ngrx/store';
import {User} from "./participant.reducer";

export const addUser = createAction(
  '[PARTICIPANT] add user',
  props<User>()
);
export const removeUser = createAction(
  '[PARTICIPANT] remove user',
  props<User>()
);
export const updateUser = createAction(
  '[PARTICIPANT] update user',
  props<User>()
);
export const removeAllUsers = createAction(
  '[PARTICIPANT] remove all users'
);
export  const addBitrateMicrophone = createAction(
  '[PARTICIPANT] add users bitrate',
  props<{arr:any}>()
);
