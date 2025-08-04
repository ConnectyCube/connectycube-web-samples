import { Config } from "node_modules/connectycube/dist/types/types";

export const credentials = {
  appId: 8688,
  authKey: '36E6E853-89DA-4001-B050-51A582CBD981',
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
