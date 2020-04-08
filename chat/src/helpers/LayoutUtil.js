import { LayoutProvider } from "recyclerlistview/web"
import store from '../store'

export class DialogLayoutUtil {
  static getDialogLayoutProvider(width) {
    return new LayoutProvider(
      () => {
        return "type";
      },
      (type, dim) => {
        dim.width = width;
        dim.height = 75;
      }
    );
  }
}


export class ChatLayoutUtil {
  static getChatLayoutProvider(props) {
    const { width, dialogId, currentUserId } = props
    const fontSize = 16
    const lineHeight = 1.5
    const delta = 20
    const margin = 30
    const maxWidth = new GetMaxWidthMsg(width)
    let footer = 15

    return new LayoutProvider(
      (arr) => {
        return arr;
      },
      (type, dim, index) => {
        if (store.getState().messages[dialogId][index].attachment) {
          // if send messages as attachment
          dim.width = width
          dim.height = 300
          return
        } else {
          // if send messages as string
          let maxWidthMsg
          if (store.getState().messages[dialogId][index].sender_id === currentUserId) {
            maxWidthMsg = maxWidth.currentSender
          } else {
            maxWidthMsg = maxWidth.otherSender
          }

          var fakeElem = document.createElement("canvas")
          var ctx = fakeElem.getContext("2d")
          ctx.font = `${fontSize}px 'Open Sans', sans-serif`
          var txt = store.getState().messages[dialogId][index].body

          const calcWidth = ctx.measureText(txt).width
          const lines = Math.ceil(calcWidth / (maxWidthMsg - delta))

          dim.width = width
          dim.height = lines * lineHeight * fontSize + margin + footer
        }
      }
    )
  }
}

export class GetMaxWidthMsg {
  constructor(maxScrollWidth) {
    if (maxScrollWidth < 550) {
      this.currentSender = 300
      this.otherSender = 250
    }
    if (maxScrollWidth > 550 && maxScrollWidth < 768) {
      this.currentSender = 420
      this.otherSender = 470
    }
    if (maxScrollWidth > 768 && maxScrollWidth < 960) {
      this.currentSender = 450
      this.otherSender = 500
    }
    if (maxScrollWidth > 960) {
      this.currentSender = 650
      this.otherSender = 600
    }
  }
}