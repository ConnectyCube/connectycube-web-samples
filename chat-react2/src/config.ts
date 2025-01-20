import { Config } from "connectycube/dist/types/types";

export const credentials = {
  appId: 7980,
  authKey: "CmOpsbPmTjJbYjh",
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
