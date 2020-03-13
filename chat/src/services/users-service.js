import ConnectyCube from 'connectycube'
import UserModel from '../models/user'
import store from '../store'
import { fetchUsers } from '../actions/users'

class UsersService {

  async getUserById(id) {
    ConnectyCube.users.get(id)
  }

  async getOccupants(ids) {
    const users = this.getUsers
    const currentUser = this.currentUser
    let idsForFetch = []

    // 140 system ID when a group is created through the admin panel
    ids.forEach(elem => {
      if (elem !== currentUser.id && !users[elem] && elem !== 140) {
        idsForFetch.push(elem)
      }
    })
    if (idsForFetch.length === 0) { return }
    const usersFromServer = await ConnectyCube.users.get({
      per_page: 100,
      filter: {
        field: 'id',
        param: 'in',
        value: idsForFetch,
      },
    })
    const newUsers = usersFromServer.items.map(elem => {
      return new UserModel(elem.user)
    })
    store.dispatch(fetchUsers(newUsers))
  }


  getUsersAvatar(ids) {
    const currentUserId = this.currentUser
    let userId = null
    ids.forEach(elem => {
      if (elem !== currentUserId.id) {
        userId = elem
      }
    })
    return store.getState().users[userId].avatar
  }

  async listUsersByFullName(name, usersIdsToIgnore = []) {
    if (!usersIdsToIgnore) {
      usersIdsToIgnore = [this.currentUser.id]
    }
    const allUsers = await ConnectyCube.users.get({ per_page: 100, full_name: name })
    let contacts = []
    allUsers.items.forEach(elem => {
      if (!usersIdsToIgnore.includes(elem.user.id)) {
        contacts.push(new UserModel(elem.user))
      }
    })
    return contacts
  }

  get currentUser() {
    return store.getState().currentUser.user
  }

  get getUsers() {
    return store.getState().users
  }
}

const User = new UsersService()

Object.freeze(User)

export default User

