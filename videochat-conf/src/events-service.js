window.ConnectyCubeActiveUserStatId = null
class uiUsersEvents {
  _renderSignalStat(userId) {
    if (window.ConnectyCubeActiveUserStatId !== userId) {
      if (window.ConnectyCubeActiveUserStatId !== null) {
        this.toggleSelectedUserStatIcon(window.ConnectyCubeActiveUserStatId, false)
      }
      window.ConnectyCubeActiveUserStatId = userId;
      this.toggleSelectedUserStatIcon(window.ConnectyCubeActiveUserStatId, true)
    }
  }

  toggleSelectedUserStatIcon(userId, toShow) {
    const $selectedUserStat = document.querySelector(`.display-signal-icon[data-id="${userId}"]`)
    if (toShow) {
      $selectedUserStat.classList.add('show')
    } else {
      $selectedUserStat.classList.remove('show')
    }
  }
}

const UIUsersEvents = new uiUsersEvents()
