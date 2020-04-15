import {
  PUSH_MESSAGE,
  FETCH_MESSAGES,
  DELETE_ALL_MESSAGES,
  LAZY_FETCH_MESSAGES,
  UPDATE_MESSAGES
} from '../actions/messages'

import { lazyFetchMessages, updateStatusMessages } from './reducer-function'

export default (messages = {}, action) => {
  switch (action.type) {
    case FETCH_MESSAGES: {
      const reverted = action.history
      return { ...messages, [action.dialogId]: reverted.reverse() }
    }

    case LAZY_FETCH_MESSAGES: {
      const result = lazyFetchMessages(action, messages)
      return result
    }

    case UPDATE_MESSAGES: {
      const mergedUpdatedMessages = updateStatusMessages(action, messages)
      return mergedUpdatedMessages
    }

    case PUSH_MESSAGE: {
      console.log('{redux-action} push redux new message', action)
      return {
        ...messages,
        [action.dialogId]: [...messages[action.dialogId] || [], action.message]
      }
    }

    case DELETE_ALL_MESSAGES: {
      return {
        ...messages,
        [action.dialogId]: []
      }
    }

    default:
      return messages
  }
}