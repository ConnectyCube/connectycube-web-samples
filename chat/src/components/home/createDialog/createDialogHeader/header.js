import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import './header.css'

export default function createDialogHeader({ router }) {
  function goToSplashPage() {
    router('/home/')
  }
  return (
    <div className="create-dialog-header">
      <button onClick={goToSplashPage}>
        <FontAwesomeIcon icon={faChevronLeft} color={'black'} />
        <span>Back</span>
      </button>
    </div>
  )
}