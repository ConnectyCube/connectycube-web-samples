export const messages = {
  login:
    'Login as any user on this computer and another user on another computer.',
  create_session: 'Creating a session...',
  connect: 'Connecting...',
  connect_error:
    'Something went wrong with the connection. Check internet connection or user info and try again.',
  login_as: 'Logged in as ',
  title_login: 'Choose a user to login with:',
  title_callee: 'Choose users to call:',
  calling: 'Calling...',
  webrtc_not_avaible: 'WebRTC is not available in your browser',
  no_internet: 'Please check your Internet connection and try again',
  select_more_users: 'Select at less one user to start Videocall',
  share_call_link:
    'Share the above url with the users you want to have a call with',
  prompt_user_name: 'Input user name',
  confirm_cancel: 'Do you shure to leave the call ?',
};

export const E2E_STATE_ELEMENT_ID = 'e2e-ice-state';

export const credentials = {
  appId: REPLACE_APP_ID,
  authKey: "REPLACE_APP_AUTH_KEY",
  authSecret: "REPLACE_APP_AUTH_SECRET"
};

export const appConfig = {
  debug: { mode: 1 },
};

export const users = [
  {
    id: REPLACE_USER_1_ID,
    name: "REPLACE_USER_1_FULL_NAME",
    login: "REPLACE_USER_1_LOGIN",
    password: "REPLACE_USER_1_PASSWORD",
    color: "#34ad86"
  },
  {
    id: REPLACE_USER_2_ID,
    name: "REPLACE_USER_2_FULL_NAME",
    login: "REPLACE_USER_2_LOGIN",
    password: "REPLACE_USER_2_PASSWORD",
    color: "#077988"
  },
  {
    id: REPLACE_USER_3_ID,
    name: "REPLACE_USER_3_FULL_NAME",
    login: "REPLACE_USER_3_LOGIN",
    password: "REPLACE_USER_3_PASSWORD",
    color: "#13aaae"
  },
  {
    id: REPLACE_USER_4_ID,
    name: "REPLACE_USER_4_FULL_NAME",
    login: "REPLACE_USER_4_LOGIN",
    password: "REPLACE_USER_4_PASSWORD",
    color: "#056a96"
  }
];

const isCordovaEnv = !!window.cordova;

export const GUEST_ROOM_ONLY_MODE = false;
export const CALLING_ONLY_MODE = isCordovaEnv;

export const NO_ANSWER_TIMER = 30000; // 30 sec

export const GET_USERS_STATS_TIME_INTERVAL = 3000;

export const MAX_MIC_LEVEL = 20000;

export const CLEANING_SLOW_LINK_INTERVAL = 10; //sec

export const defaultAvatarsList = [
  'animals_1.jpg',
  'animals_2.jpg',
  'animals_3.jpg',
  'animals_4.jpg',
  'animals_5.jpg',
  'animals_6.jpg',
  'animals_7.jpg',
  'animals_8.jpg',
  'animals_9.jpg',
  'animals_10.jpg',
];
