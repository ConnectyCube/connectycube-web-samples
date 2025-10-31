import type { Config } from "@connectycube/react";

export const credentials = {
  appId: "385",
  authKey: "F111EE6B-5B16-4BE4-9107-BEA18F3D03BC",
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
