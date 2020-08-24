window.ConnectyCubeActiveUserStatId = null
class uiUsersEvents {
  _renderSignalStat(userId) {
    if (window.ConnectyCubeActiveUserStatId !== userId) {
      if (window.ConnectyCubeActiveUserStatId !== null) {
        this.togglePopUp(window.ConnectyCubeActiveUserStatId, false)
      }
      window.ConnectyCubeActiveUserStatId = userId;
      this.togglePopUp(window.ConnectyCubeActiveUserStatId, true)
    }
  }

  togglePopUp(userId, toShow) {
    const $selectedUserStat = document.querySelector(`.display-popup[data-id="${userId}"]`)
    if (!$selectedUserStat) {
      return
    }
    if (toShow) {
      $selectedUserStat.classList.add('show')
    } else {
      $selectedUserStat.classList.remove('show')
    }
  }

  showFullscreen(userId) {
    const $selectedFullScreen = document.getElementsByClassName(`stream-${userId}`)
    const currentElem = $selectedFullScreen[0]

    if (currentElem.requestFullscreen) {
      currentElem.requestFullscreen();
    } else if (currentElem.mozRequestFullScreen) { /* Firefox */
      currentElem.mozRequestFullScreen();
    } else if (currentElem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      currentElem.webkitRequestFullscreen();
    } else if (currentElem.msRequestFullscreen) { /* IE/Edge */
      currentElem.msRequestFullscreen();
    }
    const $selectedCloseFullScreen = document.getElementsByClassName(`display-full-screen-close`)
    $selectedCloseFullScreen[0].classList.remove('display-full-screen-close-show')
  }
}

const UIUsersEvents = new uiUsersEvents()
