import CC from "connectycube/dist/types/types";
import {environment} from "../../environments/environment";

export const CREDENTIALS: CC.Config.Credentials = {
  appId: Number(environment.APP_ID),
  authKey: environment.AUTH_KEY,
};

export const appConfig: Readonly<any> = {
  debug: {mode: 1},
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

export const pathToLoader: Readonly<string> = "../../assets/loader.svg";

export const imageMIMETypes: ReadonlyArray<string> = [
  "image/bmp",
  "image/cis-cod",
  "image/gif",
  "image/ief",
  "image/jpeg",
  "image/png",
  "image/pipeg",
  "image/svg+xml",
  "image/tiff",
  "image/x-cmu-raster",
  "image/x-cmx",
  "image/x-icon",
  "image/x-portable-anymap",
  "image/x-portable-bitmap",
  "image/x-portable-graymap",
  "image/x-portable-pixmap",
  "image/x-rgb",
  "image/x-xbitmap",
  "image/x-xpixmap",
  "image/x-xwindowdump",
]
