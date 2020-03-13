import {
  FETCH_USERS,
} from '../actions/users'

import { fetchUsers } from './reducer-function'

export default (users = {}, action) => {
  switch (action.type) {
    case FETCH_USERS: {
      return fetchUsers(action.users, users)
    }

    default: {
      return users
    }
  }
}