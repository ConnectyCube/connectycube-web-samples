import { combineReducers } from 'redux'
import currentUser from './currentUser'
import dialogs from './dialogs'
import selectedDialog from './selectedDialog'
import messages from './messages'
import users from './users'

const appReducer = combineReducers({
  currentUser,
  dialogs,
  selectedDialog,
  messages,
  users,
})


export const LogOut = () => ({ type: 'RESSET_STORE' })

const rootReducer = (state, action) => {
  if (action.type === 'RESSET_STORE') {
    state = {}
  }
  return appReducer(state, action)
}


export default rootReducer