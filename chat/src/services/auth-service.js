import ConnectyCube from 'connectycube'
import appConfig from '../appConfig.json'
import User from '../models/user'
import store from '../store'
import { setCurrentUser } from '../actions/currentUser'
import { getImageLinkFromUID } from '../helpers/file'
import { LogOut } from '../reducers/index'

class AuthService {
  static CURRENT_USER_SESSION_KEY = 'CURRENT_USER_SESSION_KEY'
  static DEVICE_TOKEN_KEY = 'DEVICE_TOKEN_KEY'

  async init() {
    await ConnectyCube.init(...appConfig.connectyCubeConfig)
    return this.autologin()
  }

  async autologin() {
    const checkUserSessionFromStore = await this.getUserSession()
    if (checkUserSessionFromStore) {
      const data = JSON.parse(checkUserSessionFromStore)
      await this.signIn({ login: data.login, password: data.password })
      return 'home'
    } else { return 'auth' }
  }

  async signIn(params) {
    const session = await ConnectyCube.createSession(params)
    const currentUser = new User(session.user)
    session.user.avatar = getImageLinkFromUID(session.user.avatar)
    // work around
    session.user.full_name = session.user.login
    store.dispatch(setCurrentUser(session))
    const customSession = Object.assign({}, currentUser, { password: params.password })
    this.setUserSession(customSession)
    this.connect(customSession.id, customSession.password)
  }

  async signUp(params) {
    await ConnectyCube.createSession()
    await ConnectyCube.users.signup(params)
    return this.signIn(params)
  }

  async connect(userId, password) {
    await ConnectyCube.chat.connect({ userId, password })
  }

  setUserSession(userSession) {
    return localStorage.setItem(AuthService.CURRENT_USER_SESSION_KEY, JSON.stringify(userSession))
  }

  getUserSession() {
    return localStorage.getItem(AuthService.CURRENT_USER_SESSION_KEY)
  }

  async logout() {
    localStorage.clear()
    await ConnectyCube.logout()
    store.dispatch(LogOut())
  }


}

const authService = new AuthService()

Object.freeze(authService)

export default authService