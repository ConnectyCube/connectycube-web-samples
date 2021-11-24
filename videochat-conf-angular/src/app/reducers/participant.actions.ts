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
export const addMicrophoneLevel = createAction(
  '[PARTICIPANT] add users volume levels',
  props<{ idVolumeLevelMap: Map<number, number> }>()
);
export const addBitrate = createAction(
  '[PARTICIPANT] add users bitrate',
  props<{ idBitrateMap: Map<number, string> }>()
);
export const updateConnectionStatus = createAction(
  '[PARTICIPANT] update user connection status',
  props<{id:number,connectionStatus:string}>()
);
