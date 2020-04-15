import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import './userProfile.css'
import AuthService from '../../../../services/auth-service'
import Modal from 'react-modal'
import { Link } from "react-router-dom"
import Avatar from '../../../../helpers/avatar/avatar'


class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isModal: false
    }
  }

  customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      border: 'none',
      padding: 0,
    }
  }

  showMoreInformation = () => {
    this.setState({ isModal: !this.state.isModal })
  }

  handleCloseModal = () => (this.setState({ isModal: false }))

  logOut = () => {
    AuthService.logout()
  }

  settings = () => {
    alert("Coming soon")
    this.handleCloseModal()
  }

  render() {
    const { isModal } = this.state
    const { currentUser } = this.props
    if (!currentUser) {
      return <></>
    }

    const { user } = currentUser
    return (
      <div className="user-rofile-container">
        <div className="user-profile-wrapper">
          <div className="user-profile-user-info">
            <div className="online">
              <Avatar photo={user.avatar} name={user.full_name} size={50} />
            </div>
            <span>{user.full_name}</span>
          </div>
          <div className="user-profile-icon" id="user-profile-icon" onClick={this.showMoreInformation}>
            {isModal ?
              <FontAwesomeIcon icon={faChevronUp} color={'white'} /> :
              <FontAwesomeIcon icon={faChevronDown} color={'#435f7a'} />
            }
          </div>
        </div>
        {isModal &&
          <>
            <Modal
              isOpen={isModal}
              onRequestClose={this.handleCloseModal}
              ariaHideApp={false}
              style={this.customStyles}
              overlayClassName="Overlay-user-profile"
            />
            <div className="user-profile-modal">
              <ul>
                <li className="user-profile-user-more-info">
                  <Link
                    to="/auth"
                    onClick={this.logOut}
                    className="reset-user-profile">Logout</Link>
                </li>
                <li className="user-profile-user-more-info">
                  <Link
                    to="/home"
                    onClick={this.settings}
                    className="reset-user-profile">Settings</Link>
                </li>
              </ul>
            </div>
          </>
        }
      </div>
    )
  }
}


const mapStateToProps = ({ currentUser }) => ({
  currentUser
})

export default connect(mapStateToProps)(UserProfile)
