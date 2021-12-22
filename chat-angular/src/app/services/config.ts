import {environment} from "../../environments/environment";

export const CREDENTIALS = {
  appId: Number(environment.APP_ID),
  authKey: environment.AUTH_KEY,
  authSecret: environment.AUTH_SECRET,
};

export const appConfig = {
  debug: {mode: 1},
  conference: {server: environment.CONFERENCE_SERVER_ENDPOINT},
  endpoints: {
    api: environment.API_ENDPOINT,
    chat: environment.CHAT_ENDPOINT
  }
}

export interface Message {
  senderName?: string,
  body: string,
  time: string,
  statusUndefined?: boolean,
}

export interface ItemsHeight {
  items: Array<number>,
  itemsTotalHeight: number
}
