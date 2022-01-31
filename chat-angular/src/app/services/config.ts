import {environment} from "../../environments/environment";
import {participant} from "../reducers/participants/participants.reducer";

export const CREDENTIALS = {
  appId: Number(environment.APP_ID),
  authKey: environment.AUTH_KEY,
  authSecret: environment.AUTH_SECRET,
};

export const appConfig = {
  debug: {mode: 1},
  conference: {server: environment.CONFERENCE_SERVER_ENDPOINT},
  chat: {
    streamManagement: {
      enable: true
    }
  },
  endpoints: {
    api: environment.API_ENDPOINT,
    chat: environment.CHAT_ENDPOINT
  }
}

export interface Message {
  id: string,
  senderId: number,
  senderName?: string,
  status: string
  body: string,
  date_sent: number,
  photo?: string | undefined,
  width?: number,
  height?: number
}

export interface ItemsHeight {
  items: Array<number>,
  itemsTotalHeight: number
}

export interface Dialog {
  id: string,
  name: string,
  type: number
  photo: string | null,
  lastMessage: string | null,
  lastMessageDate: number | null,
  lastMessageUserId: number | null,
  unreadMessage: number,
  createAt: string,
  msgIds: Array<string>,
  participantIds: Array<number>
  typingParticipants: Array<{ id: number, name: string }>
}

export const pathToLoader: string = "https://cb-shared-s3.s3.amazonaws.com/DFC81AD9BBD13D883039055EDD1B6499CCD3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT5XTT6Q7MZUGSZX5%2F20220131%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220131T122629Z&X-Amz-Expires=3600&X-Amz-Signature=9a8b0b4c0bfab5eaf2aa45d43ee9bcafdc83fd8a1a816740e2bf947c27ff7d00&X-Amz-SignedHeaders=host&response-cache-control=max-age%3D604800";
