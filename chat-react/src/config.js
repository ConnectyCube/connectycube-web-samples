export const credentials = {
  appId: process.env.REACT_APP_CONNECTYCUBE_APP_ID,
  authKey: process.env.REACT_APP_CONNECTYCUBE_AUTH_KEY,
  authSecret: process.env.REACT_APP_CONNECTYCUBE_AUTH_SECRET,
};

export const appConfig = {
  debug: {
    mode: 1,
  },
  endpoints: {
    api: process.env.REACT_APP_CONNECTYCUBE_API_ENDPOINT,
    chat: process.env.REACT_APP_CONNECTYCUBE_CHAT_ENDPOINT,
  },
  chat: {
    streamManagement: {
      enable: true,
    },
  },
};