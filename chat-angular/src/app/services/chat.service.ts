import {Injectable} from '@angular/core';
import {Dialog} from "./config";
import {Store} from "@ngrx/store";
import {addDialogs} from "../reducers/dialog.actions";

declare let ConnectyCube: any;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public dialogsHeight: Map<number, number> = new Map<number, number>();
  public tempHeight: number = 0;

  constructor(private store$: Store) {
  }

  public getDialogs() {
    ConnectyCube.chat.dialog
      .list()
      .then((result: any) => {
        const dialogs: Array<Dialog> = result.items.map((d: any) => {
          const dialog: Dialog = {
            id: d._id, name: d.name, photo: d.photo, lastMessage: d.last_message,
            lastMessageDate: d.last_message_date_sent, unreadMessage: d.unread_messages_count,
            createAt: d.created_at
          };
          return dialog;
        })
        console.warn("[Processed dialogs]", dialogs);
        this.store$.dispatch(addDialogs({dialogs}));
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  public searchFullName(fullName: string) {
    const searchParams = {full_name: fullName};

    return ConnectyCube.users
      .get(searchParams)
  }

  public searchLogin(login: string) {
    const searchParams = {login: login};
    return ConnectyCube.users
      .get(searchParams)
  }

}
