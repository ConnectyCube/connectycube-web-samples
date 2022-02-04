import {environment} from "../../environments/environment";

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
  creatorId: number,
  lastMessage: string | null,
  lastMessageDate: number | null,
  lastMessageUserId: number | null,
  unreadMessage: number,
  createAt: string,
  msgIds: Array<string>,
  participantIds: Array<number>
  typingParticipants: Array<{ id: number, name: string }>
}

export const pathToLoader: string = "../../assets/loader.svg";
