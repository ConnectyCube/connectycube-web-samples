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
  webrtc_not_available: "WebRTC is not available in your browser",
  no_internet: "Please check your Internet connection and try again"
};

export const credentials = {
  appId: "385",
  authKey: "F111EE6B-5B16-4BE4-9107-BEA18F3D03BC",
};

export const appConfig = {
  debug: { mode: 1 },
  videochat: {
    answerTimeInterval: 15,
    //   dialingTimeInterval: 5,
    disconnectTimeInterval: 300,
    //   statsReportTimeInterval: 5
  },
};

export const users = [
  {
    id: 13731688,
    name: "Aaron",
    login: "Aaron",
    password: "video_chat_user_1",
  },
  {
    id: 13731691,
    name: "Bella",
    login: "Bella",
    password: "video_chat_user_2",
  },
  {
    id: 13731692,
    name: "Chloe",
    login: "Chloe",
    password: "video_chat_user_3",
  },
  {
    id: 13731694,
    name: "David",
    login: "David",
    password: "video_chat_user_4",
  }
];
