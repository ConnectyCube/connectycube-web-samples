import {environment} from "../../environments/environment";

export const CREDENTIALS = {
  appId: Number(environment.APP_ID),
  authKey: environment.AUTH_KEY,
  authSecret: environment.AUTH_SECRET,
};

export const appConfig = {
  debug: {mode: 1},
  conference: {server: environment.SERVER},
}

export const mediaParams = {
  audio: true,
  video: true
};

export const constraints = {
  video: {
    width: 1920,
    height: 1080,
    frameRate: {ideal: 25, max: 30},
  },
  audio: true,
};

