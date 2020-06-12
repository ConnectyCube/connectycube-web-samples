export const messages = {
  login:
    "Login as any user on this computer and another user on another computer.",
  create_session: "Creating a session...",
  connect: "Connecting...",
  connect_error:
    "Something went wrong with the connection. Check internet connection or user info and try again.",
  login_as: "Logged in as ",
  title_login: "Choose a user to login with:",
  title_callee: "Choose users to call:",
  calling: "Calling...",
  webrtc_not_avaible: "WebRTC is not available in your browser",
  no_internet: "Please check your Internet connection and try again",
  select_more_users: "Select at less one user to start Videocall",
  share_call_link: "Share the above url with the users you want to have a call with",
  prompt_user_name: "Input user name",
  confirm_cancel: "Do you shure to leave the call ?"
};

export const credentials = {
  appId: 385,
  authKey: "DFBMs5-dKBBCXcd",
  authSecret: "SkCW-ThdnmRg9Za"
};

export const appConfig = {
  debug: { mode: 1 },
  conference: { server: 'wss://janus.connectycube.com:8989' }
};

export const users = [
  {
    id: 72780,
    name: "Alice",
    login: "videouser1",
    password: "videouser1",
    color: "#34ad86"
  },
  {
    id: 72781,
    name: "Bob",
    login: "videouser2",
    password: "videouser2",
    color: "#077988"
  },
  {
    id: 590565,
    name: "Ciri",
    login: "videouser3",
    password: "videouser3",
    color: "#13aaae"
  },
  {
    id: 590583,
    name: "Dexter",
    login: "videouser4",
    password: "videouser4",
    color: "#056a96"
  }
];

const isCordovaEnv = !!window.cordova;

export const GUEST_ROOM_ONLY_MODE = false
export const CALLING_ONLY_MODE = isCordovaEnv;

export const NO_ASNWER_TIMER = 30000 // 30 sec

export const defaultAvatar =
  [
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
  ]