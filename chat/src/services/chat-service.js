import ConnectyCube from 'connectycube'
import Dialog from '../models/dialogs'
import {
  fetchDialogs,
  sortDialogs,
  updateDialog,
  addNewDialog,
} from '../actions/dialogs'
import {
  pushMessage,
  fetchMessages,
  lazyFetchMessages,
  updateMessages,
} from '../actions/messages'
import { preparationAttachment } from '../helpers/file'
import { selectedDialog } from '../actions/selectedDialog'
import { fetchUsers } from '../actions/users'
import store from '../store'
import { Message, FakeMessage } from '../models/message'
import UserModel from '../models/user'
import { DIALOG_TYPE } from '../helpers/constants'
import {
  STATUS_DELIVERED,
  STATUS_READ,
  STATUS_SENT,
  GROUP_CHAT_ALERT_TYPE
} from '../models/message'

class ChatService {

  setUpListeners() {
    ConnectyCube.chat.onMessageListener = this.onMessageListener.bind(this)
    ConnectyCube.chat.onSentMessageCallback = this.onSentMessageListener.bind(this)
    ConnectyCube.chat.onDeliveredStatusListener = this.onDeliveredStatus.bind(this)
    ConnectyCube.chat.onReadStatusListener = this.onReadStatus.bind(this)
  }

  async fetchDialogsFromServer() {
    if (store.getState().dialogs.length !== 0) {
      return store.getState().dialogs
    }
    const dialogsFromServer = await ConnectyCube.chat.dialog.list()
    const currentUserId = this.currentUser
    let privatChatIdsUser = []

    const dialogs = dialogsFromServer.items.map(elem => {
      if (elem.type === DIALOG_TYPE.PRIVATE) {
        elem.occupants_ids.forEach(elem => {
          elem !== currentUserId.id && privatChatIdsUser.push(elem)
        })
      }
      return new Dialog(elem)
    })

    if (privatChatIdsUser.length !== 0) {
      const usersInfo = await this.getUsersList(privatChatIdsUser)
      store.dispatch(fetchUsers(usersInfo))
    }

    store.dispatch(fetchDialogs(dialogs))
    return store.getState().dialogs
  }

  async getMessages(dialog) {
    const isAlredyUpdate = this.getMessagesByDialogId(dialog.id)
    let amountMessages = null

    // If the first entry into the chat
    if (!dialog.isAlreadyMessageFetch || dialog.unread_messages_count > 0 && !dialog.isAlreadyMessageFetch) {
      const historyFromServer = await ConnectyCube.chat.message.list({
        chat_dialog_id: dialog.id,
        sort_desc: 'date_sent'
      })

      const messages = []
      historyFromServer.items.forEach(elem => {
        if (!elem.group_chat_alert_type) {
          messages.push(new Message(elem, this.currentUser.id))
        }
      })

      const newObj = Object.assign(dialog, { isAlreadyMessageFetch: true })
      this.updateDialogsUnreadMessagesCount(newObj)
      store.dispatch(fetchMessages(dialog.id, messages))
      amountMessages = messages.length
    } else {
      // If the second entry into the chat
      if (dialog.unread_messages_count > 0) {
        const messages = this.getMessagesByDialogId(dialog.id)
        const firstUnreadMsg = messages[dialog.unread_messages_count - 1]
        this.readAllMessages(dialog.id)
        await this.sendReadStatus(firstUnreadMsg.id, firstUnreadMsg.sender_id, firstUnreadMsg.dialog_id)
        this.updateDialogsUnreadMessagesCount(dialog)
      }
      amountMessages = isAlredyUpdate.length
    }
    return amountMessages
  }

  // Message loading if more than 100
  getMoreMessages = async (dialog) => {
    const currentMessages = this.getMessagesByDialogId(dialog.id)
    const lastMessageDate = currentMessages[0]
    const updateObj = Object.assign(dialog, { last_messages_for_fetch: lastMessageDate.date_sent })

    const filter = {
      chat_dialog_id: dialog.id,
      date_sent: { lt: lastMessageDate.date_sent },
      sort_desc: 'date_sent'
    }

    const moreHistoryFromServer = await ConnectyCube.chat.message.list(filter)

    const messages = []
    moreHistoryFromServer.items.forEach(elem => {
      if (!elem.group_chat_alert_type) {
        messages.push(new Message(elem, this.currentUser.id))
      }
    })

    store.dispatch(updateDialog(updateObj))
    const amountMessages = store.dispatch(lazyFetchMessages(dialog.id, messages))
    return amountMessages.history.length
  }


  async sendMessage(dialog, messageText, attachments = false, scrollToBottom) {
    const user = this.currentUser
    const text = messageText.trim()
    const date = Math.floor(Date.now() / 1000)
    const recipient_id = dialog.type === DIALOG_TYPE.PRIVATE ? dialog.occupants_ids.find(elem => elem != user.id)
      : dialog.xmpp_room_jid

    let msg = {
      type: dialog.xmpp_type,
      body: text,
      extension: {
        save_to_history: 1,
        dialog_id: dialog.id,
        sender_id: user.id,
        date_sent: date,
      },
      // markable: 1
    }

    msg.id = this.messageUniqueId

    // If send message as Attachment
    if (attachments) {
      return this.sendMessageAsAttachment(dialog, recipient_id, msg, attachments, scrollToBottom)
    }

    const message = new FakeMessage(msg)

    const newObjFreez = Object.freeze(message)

    await store.dispatch(pushMessage(newObjFreez, dialog.id))
    scrollToBottom()
    ConnectyCube.chat.send(recipient_id, msg)
    store.dispatch(sortDialogs(newObjFreez))
  }


  sendMsgChatAlertOnCreate = async (dialog, message, alertType) => {
    const date = Math.floor(Date.now() / 1000)
    const recipient_id = dialog.type === DIALOG_TYPE.PRIVATE ? dialog.occupants_ids.find(elem => elem != this.currentUser.id)
      : dialog.xmpp_room_jid
    const messageExtensions = {
      date_sent: date,
      save_to_history: 1,
      dialog_id: dialog.id,
      group_chat_alert_type: alertType,
      sender_id: this.currentUser.id,
    }
    const msg = {
      type: !dialog.xmpp_room_jid ? 'chat' : 'groupchat',
      body: message,
      extension: messageExtensions,
    }
    ConnectyCube.chat.send(recipient_id, msg)
  }

  sendChatAlertOnCreate(dialog) {
    const message = 'Group is created'
    this.sendMsgChatAlertOnCreate(dialog, message, GROUP_CHAT_ALERT_TYPE.CREATE)
  }

  async sendMessageAsAttachment(dialog, recipient_id, msg, attachments, scrollToBottom) {
    //create fake data for render img
    const url = URL.createObjectURL(attachments.file)
    msg.extension.attachments = [{ url }]
    msg.body = 'Image attachment'
    const message = new FakeMessage(msg)
    await store.dispatch(pushMessage(message, dialog.id))
    scrollToBottom()

    // create real data for attachment
    const response = await this.uploadPhoto(attachments)
    const newObjAttach = preparationAttachment(response)
    msg.extension.attachments = [newObjAttach]
    await ConnectyCube.chat.send(recipient_id, msg)
    store.dispatch(sortDialogs(message))
    return
  }

  async createPrivateDialog(userId) {
    const dialogs = store.getState().dialogs
    let dialog = null

    dialogs.forEach(elem => {
      if (elem.type === DIALOG_TYPE.PRIVATE && elem.occupants_ids.find(elem => elem === userId)) {
        dialog = elem
      }
    })

    if (!dialog) {
      const params = {
        type: DIALOG_TYPE.PRIVATE,
        occupants_ids: userId,
      }

      const response = await ConnectyCube.chat.dialog.create(params)
      dialog = new Dialog(response)
      if (this.getUserFromReduxById(userId)) {
        store.dispatch(addNewDialog(dialog))
        return dialog
      } else {
        const usersInfo = await this.getUserFromServerById(userId)
        usersInfo.user = new UserModel(usersInfo.user)
        store.dispatch(fetchUsers([usersInfo.user]))
        store.dispatch(addNewDialog(dialog))
        return dialog
      }
    }

    // If the user is already in the Redux
    if (this.getUserFromReduxById(userId)) {
      return dialog
    } else {
      const usersInfo = await this.getUserFromServerById(userId)
      usersInfo.user = new UserModel(usersInfo.user)
      store.dispatch(fetchUsers([usersInfo.user]))
      return dialog
    }
  }


  updateDialogsUnreadMessagesCount = (dialog) => {
    const updateObj = Object.assign(dialog, { unread_messages_count: 0 })
    store.dispatch(updateDialog(updateObj))
    return true
  }

  async createPublicDialog(occupants_ids, groupName, img) {
    const currentUser = this.currentUser
    occupants_ids.unshift(currentUser.id)
    const params = {
      type: DIALOG_TYPE.GROUP,
      occupants_ids,
      name: groupName,
    }
    const image = img ? await this.uploadPhoto(img) : null
    if (image) {
      params.photo = image.uid
    }
    const dialog = await ConnectyCube.chat.dialog.create(params)
    const newDialog = new Dialog(dialog)
    store.dispatch(addNewDialog(newDialog))
    return newDialog
  }

  async readAllMessages(dialogId) {
    return ConnectyCube.chat.message.update(null, {
      chat_dialog_id: dialogId,
      read: 1
    })
  }

  async readMessage(messageId, dialogId) {
    this.onReadStatus(messageId, dialogId)
    return ConnectyCube.chat.message.update(null, {
      chat_dialog_id: dialogId,
      read: 1
    })
  }

  async onMessageListener(senderId, msg) {
    const message = new Message(msg)
    const user = this.currentUser
    const dialog = this.getSelectedDialog()?.id

    // If group chat alet
    if (msg.extension.group_chat_alert_type) {
      const dialogsFromServer = await ConnectyCube.chat.dialog.list()
      const dialogs = dialogsFromServer.items.map(elem => {
        return new Dialog(elem)
      })
      store.dispatch(fetchDialogs(dialogs))
      return
    }

    if (senderId !== user.id) {
      if (dialog === message.dialog_id) {
        store.dispatch(sortDialogs(message))
        this.readMessage(message.id, message.dialog_id)
        this.sendReadStatus(msg.extension.message_id, msg.extension.sender_id, msg.dialog_id)
      } else {
        this.sendDeliveredStatus(msg.extension.message_id, msg.extension.sender_id, msg.dialog_id)
        store.dispatch(sortDialogs(message, true))
      }
      store.dispatch(pushMessage(message, message.dialog_id))
    }
  }

  // ConnectyCube listeners
  onSentMessageListener(failedMessage, msg) {
    console.warn('onSentMessageListener')
    if (failedMessage || msg.extension.group_chat_alert_type) {
      return
    }
    store.dispatch(updateMessages(msg.extension.dialog_id, msg.id, { send_state: STATUS_SENT }))
  }

  onDeliveredStatus(messageId, dialogId, userId) {
    console.warn('onDeliveredStatus', messageId)
    store.dispatch(updateMessages(dialogId, messageId, { send_state: STATUS_DELIVERED }))
  }

  onReadStatus(messageId, dialogId, userId) {
    console.warn('onReadStatus', messageId)
    store.dispatch(updateMessages(dialogId, messageId, { send_state: STATUS_READ }))
  }



  sendReadStatus(messageId, userId, dialogId) {
    ConnectyCube.chat.sendReadStatus({ messageId, userId, dialogId })
  }

  sendDeliveredStatus(messageId, userId, dialogId) {
    ConnectyCube.chat.sendDeliveredStatus({ messageId, userId, dialogId })
  }

  async getUsersList(ids) {
    const usersList = await ConnectyCube.users.get({
      per_page: 100,
      filter: {
        field: 'id', param: 'in', value: ids,
      },
    })

    return usersList.items.map(elem => {
      return new UserModel(elem.user)
    })
  }

  async getUserFromServerById(id) {
    return ConnectyCube.users.get(id)
  }

  setSelectDialog(dialog) {
    store.dispatch(selectedDialog(dialog))
  }

  getSelectedDialog() {
    return store.getState().selectedDialog
  }

  getDialogById(dialogId) {
    return store.getState().dialogs.find(elem => elem.id === dialogId)
  }

  getMessagesByDialogId(dialogId) {
    const result = store.getState().messages
    return result[dialogId]
  }

  async uploadPhoto(file) {
    return ConnectyCube.storage.createAndUpload(file)
  }

  get currentUser() {
    return store.getState().currentUser.user
  }

  getUserFromReduxById(id) {
    return store.getState().users[id]
  }

  get messageUniqueId() {
    return ConnectyCube.chat.helpers.getBsonObjectId()
  }
}


const chatService = new ChatService()

Object.freeze(chatService)

export default chatService

