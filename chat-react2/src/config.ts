import { Config } from "connectycube/dist/types/types";

export const credentials = {
  appId: 1,
  authKey: "2",
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
