import {environment} from "../../environments/environment";

export const CREDENTIALS = {
  appId: Number(environment.APP_ID),
  authKey: environment.AUTH_KEY,
  authSecret: environment.AUTH_SECRET,
};

export const appConfig = {
  debug: {mode: 1},
  conference: {server: environment.SERVER},
  endpoints: {
    api: environment.API_ENDPOINT,
    chat: environment.CHAT_ENDPOINT
  }
}

export const mediaParams = {
  audio: true,
  video: true
};

export const constraints = {
  video: true,
  audio: true,
};
