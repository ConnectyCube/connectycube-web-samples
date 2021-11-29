import {createAction, props} from '@ngrx/store';

export const addVideoPermission = createAction(
  '[INTERFACE] add video permission',
  props<{videoPermission:boolean}>()
);
export const addAudioPermission = createAction(
  '[INTERFACE] add audio permission',
  props<{audioPermission:boolean}>()
);

