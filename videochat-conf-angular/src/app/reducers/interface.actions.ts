import {createAction, props} from '@ngrx/store';

export const addVideoPermission = createAction(
  '[INTERFACE] add video permission',
  props<{ videoPermission: boolean }>()
);
export const addAudioPermission = createAction(
  '[INTERFACE] add audio permission',
  props<{ audioPermission: boolean }>()
);
export const addChatOpenStatus = createAction(
  '[INTERFACE] add chat open status',
  props<{ chatOpenStatus: boolean }>()
);
export const addControlButtonsStatus = createAction(
  '[INTERFACE] add control buttons status',
  props<{ controlButtonsStatus: boolean }>()
)
export const addSwitchVideoStatus = createAction(
  '[INTERFACE] add switch video status',
  props<{ switchVideoStatus: boolean }>()
)
