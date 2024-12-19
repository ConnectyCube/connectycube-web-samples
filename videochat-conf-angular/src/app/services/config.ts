import {environment} from "../../environments/environment";

export const CREDENTIALS = {
  appId: Number(environment.APP_ID),
  authKey: environment.AUTH_KEY
};

export const appConfig = {
  debug: { mode: 1 },
}

export const mediaParams = {
  audio: true,
  video: true
};

export const constraints = {
  video: true,
  audio: true,
};
