import {Injectable} from '@angular/core';
import {Dialog} from "./config";
import {Store} from "@ngrx/store";
import {addDialog, addDialogs} from "../reducers/dialog.actions";
import {dialogsSelector} from "../reducers/dialog.selectors";
import {take} from 'rxjs/operators';

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

  public createGroupChat(name: string, description: string, idArray: Array<number>, photo?: string) {
    const params = {
      type: 2,
      name: name,
      occupants_ids: idArray,
      description: description,
      photo: photo,
    };

    ConnectyCube.chat.dialog
      .create(params)
      .then((d: any) => {
        console.warn(d);
        const dialog: Dialog = {
          id: d._id, name: d.name, photo: d.photo, lastMessage: d.last_message,
          lastMessageDate: d.last_message_date_sent, unreadMessage: d.unread_messages_count,
          createAt: d.created_at
        };
        console.warn(dialog)
        this.store$.dispatch(addDialog({dialog}));
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  public createIndividualChat(id: number) {
    const params = {
      type: 3,
      occupants_ids: [id],
    };

    ConnectyCube.chat.dialog
      .create(params)
      .then((d: any) => {
        const dialog: Dialog = {
          id: d._id, name: d.name, photo: d.photo, lastMessage: d.last_message,
          lastMessageDate: d.last_message_date_sent, unreadMessage: d.unread_messages_count,
          createAt: d.created_at
        };
        console.warn(dialog)
        this.store$.select(dialogsSelector).pipe(take(1)).subscribe(res => {
          if (res !== undefined) {
            const thisIsChat = res.some((d: Dialog) => d.id === dialog.id);
            if (!thisIsChat) {
              this.store$.dispatch(addDialog({dialog}));
            }
          }
        })
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

}
