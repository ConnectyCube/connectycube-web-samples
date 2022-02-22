import {Injectable} from '@angular/core';
import {Message} from "./config";
import {Store} from "@ngrx/store";
import {getMessageHeight} from "../reducers/messages/messages.selectors";
import {take} from "rxjs/operators";
import {selectedConversationSelector} from "../reducers/dialog/dialog.selectors";

@Injectable({
  providedIn: 'root'
})
export class MeasureService {

  private idHeightCach: Map<string, number> = new Map<string, number>();
  private idPromiseCach: Map<string, Promise<any>> = new Map<string, Promise<any>>();

  constructor(private store$: Store) {
  }

  private measureText(text: string, maxWidth: number) {
    const mainStyle = `width:${maxWidth}px; word-wrap: break-word; white-space: pre-line;
     font-size: 16px; font-family: "Source Sans Pro"; line-height: 1.25`;
    const div = document.createElement('div');
    div.innerHTML = text;
    div.style.cssText = mainStyle;
    document.body.appendChild(div);
    const testHeight = div.offsetHeight;
    div.remove();

    return testHeight;
  }

  public measureImage(src: string) {
    return new Promise<{ height: number, width: number }>((resolve, reject) => {
      const img = new Image();
      img.style.cssText = `max-height: 200px;
      height: 100%;
      max-width: 100%;
      object-fit: contain;
      padding-bottom: 5px;`;
      img.addEventListener('load', () => {
        resolve(img.naturalHeight > 200 ? {
          height: 200,
          width: img.naturalWidth
        } : {height: img.naturalHeight, width: img.naturalWidth})
      });
      img.src = src;
    })
  }

  public async measureMessages(messages: Array<Message>, msgContainerWidth: number, isGroupChat: boolean, selectedDialogId: string) {
    let changeDialog = false;
    this.store$.select(selectedConversationSelector).subscribe(currentConversation => {
      if (currentConversation !== selectedDialogId) {
        changeDialog = true;
      }
    })
    const PADDING_MES: number = 22;
    const MAX_INDEX: number = messages.length - 1;
    let heightSum: number = 0;
    const itemsArray: Array<number> = [];
    let index = 0;

    for (const msg of messages) {
      if (changeDialog) {
        console.log("[Change Dialog]");
        return null;
      }
      const msgCachHeight = this.idHeightCach.get(msg.id);
      if (msgCachHeight) {
        itemsArray.push(msgCachHeight);
        heightSum += msgCachHeight;
        index++;
      }
      else {
        console.log("[CALCULATE MESSAGE]", msg.id);
        //first element + container padding
        let msgHeight: number = index === 0 ? 14 : 0;
        let maxWidth = (msgContainerWidth - 20) * 0.8;
        maxWidth = Math.round(maxWidth * 100) / 100;
        msgHeight += PADDING_MES;
        if (msg.senderName) {
          if (isGroupChat) {
            msgHeight += 19
          }
          if (index < MAX_INDEX) {
            msgHeight += messages[index + 1].senderName ? 8 : 16;
          }
        }
        else {
          if (index < MAX_INDEX) {
            msgHeight += messages[index + 1].senderName ? 16 : 8;
          }
        }

        if (msg.photo) {
          let storeHeight;
          this.store$.select(getMessageHeight, {msgId: msg.id}).pipe(take(1)).subscribe(height => {
            if (height) {
              storeHeight = height;
            }
          })
          if (storeHeight) {
            msgHeight += storeHeight;
          }
          else {
            const getImagePromise: Promise<any> = this.idPromiseCach.get(msg.id) || this.measureImage(msg.photo)
            this.setIdPromiseValue(msg.id, getImagePromise);

            const {height, width} = await getImagePromise

            this.deleteIdPromiseValue(msg.id);
            console.log(height, width);
            msgHeight += height;
          }
          msgHeight += 5;
        }
        else {
          msgHeight += this.measureText(msg.body, maxWidth);
        }

        this.idHeightCach.set(msg.id, msgHeight);

        itemsArray.push(msgHeight);
        heightSum += msgHeight;

        index++;
      }
    }

    return {items: itemsArray, itemsTotalHeight: heightSum};
  }

  public setIdPromiseValue(id: string, promise: Promise<any>) {
    this.idPromiseCach.set(id, promise);
  }

  public deleteIdPromiseValue(id: string) {
    this.idPromiseCach.delete(id);
  }

  public resetAllHeightCalculation() {
    this.idHeightCach.clear();
    this.idPromiseCach.clear();
  }
}
