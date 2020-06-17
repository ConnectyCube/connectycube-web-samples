class uiUsersEvents {
  selectedTile = null

  _renderSignalStat(userId) {
    if (this.selectedTile !== userId) {
      if (this.selectedTile !== null) {
        this.toggleSelectedUserStatIcon(this.selectedTile, false)
      }
      this.selectedTile = userId;
      this.toggleSelectedUserStatIcon(this.selectedTile, true)
    }
  }

  toggleSelectedUserStatIcon(user_id, toShow) {
    const $selectedUserStat = document.querySelector(`.display-signal-icon[data-id="${user_id}"]`)
    if (toShow) {
      $selectedUserStat.classList.add('show')
    } else {
      $selectedUserStat.classList.remove('show')
    }
  }

  onClickUserStatIcon(user_id) {
    console.warn('onClickUserStatIcon{onClickUserStatIcon}', user_id)
    console.warn('ConnectyCube.chat', ConnectyCube.chat)
  }

}

const UIUsersEvents = new uiUsersEvents()

