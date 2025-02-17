import { Config } from "node_modules/connectycube/dist/types/types";

export const credentials = {
  appId: REPLACE_APP_ID,
  authKey: 'REPLACE_APP_AUTH_KEY',
};

export const appConfig: Config.Options = {
  debug: {
    mode: 1,
  },
  chat: {
    streamManagement: {
      enable: true,
    },
  },
};
