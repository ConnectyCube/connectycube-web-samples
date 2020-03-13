import React, { PureComponent } from 'react'
import Avatar from '../../../../helpers/avatar/avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDotCircle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import './renderUser.css'

export default class User extends PureComponent {
  state = {
    isSelectedUser: false
  }

  toggleUserSelect() {
    const { selectUsers, user } = this.props
    selectUsers(user)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedUsers !== this.props.selectedUsers) {
      this.setState({ isSelectedUser: this.props.selectedUsers })
    }
  }

  render() {
    const { user, selectedUsers, dialogType } = this.props
    const { isSelectedUser } = this.state
    return (
      <div className="render-search-user" onClick={() => this.toggleUserSelect()}>
        <div className="render-search-user-info">
          <Avatar photo={user.avatar} name={user.full_name} size={40} />
          <span>{user.full_name}</span>
        </div>
        {dialogType ? isSelectedUser || selectedUsers ? (
          <FontAwesomeIcon icon={faCheckCircle} color={'green'} />
        ) : (
            <FontAwesomeIcon icon={faDotCircle} color={'black'} />
          ) : <FontAwesomeIcon icon={faArrowRight} color={'green'} />
        }
      </div>
    )
  }
}

