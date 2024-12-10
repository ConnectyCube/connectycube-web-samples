export const credentials = {
  appId: REPLACE_APP_ID,
  authKey: 'REPLACE_APP_AUTH_KEY',
  authSecret: 'REPLACE_APP_AUTH_SECRET',
};

export const appConfig = {
  debug: {
    mode: 1,
  },
  endpoints: {
    api: 'REPLACE_APP_API_DOMAIN',
    chat: 'REPLACE_APP_CHAT_DOMAIN',
  },
  chat: {
    streamManagement: {
      enable: true,
    },
  },
};