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
  no_internet: "Please check your Internet connection and try again"
};

export const credentials = {
  appId: REPLACE_APP_ID,
  authKey: "REPLACE_APP_AUTH_KEY",
  authSecret: "REPLACE_APP_AUTH_SECRET"
};

export const appConfig = {
  debug: { mode: 1 },
  videochat: {
    //   answerTimeInterval: 30,
    //   dialingTimeInterval: 5,
    disconnectTimeInterval: 300,
    //   statsReportTimeInterval: 5
  },
  endpoints: {
    api: "REPLACE_APP_API_DOMAIN",
    chat: "REPLACE_APP_CHAT_DOMAIN"
  },
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
