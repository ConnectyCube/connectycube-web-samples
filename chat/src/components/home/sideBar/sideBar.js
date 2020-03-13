import React, { Component } from 'react'
import UserProfile from './userProfile/userProfile'
import Dialogs from './dialogs/dialogs'
import './sideBar.css'

export default class SideBar extends Component {
  render() {
    const { router } = this.props
    return (
      <div className="sidebar-container">
        <UserProfile />
        <Dialogs router={router} />
      </div>
    )
  }
}

