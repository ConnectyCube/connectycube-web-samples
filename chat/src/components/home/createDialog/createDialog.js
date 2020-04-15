import React, { PureComponent } from 'react';
import CreateDialogHeader from './createDialogHeader/header'
import ImagePicker from '../../../helpers/imagePicker/imagePicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import UsersService from '../../../services/users-service'
import ChatService from '../../../services/chat-service'
import Loader from '../../../helpers/loader/loader'
import swal from 'sweetalert'
import Avatar from '../../../helpers/avatar/avatar'

import RenderUser from './renderUser/renderUser'

import './createDialog.css'

export default class CreateDialog extends PureComponent {
  listUsers = []
  userNotFound = false
  selectedUsers = []
  isGroupDetails = false
  image = null

  constructor(props) {
    super(props)
    this.state = {
      keyword: '',
      isLoader: false,
      dialogType: false,
      dialogName: '',
      isUpdate: false,
    }
  }

  toggleUserSelect = (user) => {
    let newArr = []
    this.selectedUsers.forEach(elem => {
      if (elem.id !== user.id) {
        newArr.push(elem)
      }
    })
    this.selectedUsers = newArr
    this.setState({ isUpdate: !this.state.isUpdate })
  }

  getImage = (image) => {
    this.image = image
  }

  createDialog = () => {
    let str = this.state.dialogName.trim()
    const { router } = this.props

    if (str.length < 3) {
      return swal('Warning', 'Enter more than 4 characters for group subject')
    }
    this.setState({ isLoader: true })
    const occupants_ids = this.selectedUsers.map(elem => {
      return elem.id
    })
    ChatService.createPublicDialog(occupants_ids, str, this.image)
      .then((newDialog) => {
        this.setState({ isLoader: false })
        ChatService.setSelectDialog(newDialog)
        ChatService.sendGroupChatAlertOnCreate(newDialog)
        router('/home/chat')
      })
      .catch((error) => {
        this.setState({ isLoader: false })
        swal('Error', error)
      })
  }

  searchUsers = (e) => {
    e.preventDefault()
    const { keyword } = this.state
    let str = keyword.trim()
    if (str.length > 2) {
      this.setState({ isLoader: true })
      UsersService.listUsersByFullName(str)
        .then(users => {
          this.listUsers = users
          this.userNotFound = false
          this.setState({ isLoader: false })
        })
        .catch(() => {
          this.userNotFound = true
          this.setState({ isLoader: false })
        })
    } else {
      swal('Warning', `Enter more than 3 characters`)
    }
  }

  changeTypeDialog = () => {
    this.selectedUsers = []
    this.setState({ dialogType: !this.state.dialogType })
  }

  selectUsers = (user) => {
    const { router } = this.props

    // False - Private dialog 
    if (!this.state.dialogType) {
      return ChatService.createPrivateDialog(user.id)
        .then((newDialog) => {
          ChatService.setSelectDialog(newDialog)
          router('/home/chat')
        })
        .catch((error) => {
          this.setState({ isLoader: false })
          swal('Error', error)
        })
    }

    // True - Publick dialog 
    const userSelect = this.selectedUsers.find(elem => elem.id === user.id)
    if (userSelect) {
      let newArr = []
      this.selectedUsers.forEach(elem => {
        if (elem.id !== user.id) {
          newArr.push(elem)
        }
      })
      this.selectedUsers = newArr
    } else {
      if (this.selectedUsers.length === 9) {
        swal('Warning', `Maximum 9 participants`)
        return
      }
      this.selectedUsers.push(user)
    }
    this.setState({ isUpdate: !this.state.isUpdate })
  }

  _renderUser = (item) => {
    const isSelected = this.selectedUsers.find(elem => elem.id === item.id)
    return (
      <RenderUser
        user={item}
        selectUsers={this.selectUsers}
        dialogType={this.state.dialogType}
        selectedUsers={isSelected ? true : false}
        key={item.id}
      />
    )
  }

  changeSearch = (event) => (this.setState({ keyword: event.target.value }))

  changeDialogName = (event) => (this.setState({ dialogName: event.target.value }))

  _renderSelectedUsers = (elem) => {
    return (
      <button
        key={elem.id}
        className="create-dialog-body-selected-avatar"
        onClick={() => this.toggleUserSelect(elem)}
      >
        <Avatar
          photo={elem.avatar}
          name={elem.full_name}
          size={40}
        />
        <FontAwesomeIcon icon={faTimesCircle} color={'grey'} />
      </button>
    )
  }

  render() {
    const { router } = this.props
    const { keyword, dialogType, isLoader, dialogName } = this.state
    const renderHeader = window.innerWidth < 768 ? 0 : 50
    const calHeight = dialogType ? 470 - renderHeader : 390 - renderHeader

    return (
      <div className="create-dialog-container">
        {window.innerWidth < 768 &&
          <CreateDialogHeader router={router} />
        }
        {isLoader &&
          <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
            <Loader />
          </div>
        }
        <div className="create-dialog-body">
          <div className="create-dialog-body-groupinfo">
            <ImagePicker getImage={this.getImage} />
            <input
              type="text"
              placeholder="Group Subject"
              value={dialogName}
              onChange={this.changeDialogName} />
          </div>
          <form className="create-dialog-body-search" onSubmit={this.searchUsers}>
            <input
              type="text"
              value={keyword}
              onChange={this.changeSearch}
              required
              placeholder="Type contact name"
              name="search" />
            <button onClick={this.searchUsers}>
              <FontAwesomeIcon icon={faSearch} color={'white'} />
            </button>
          </form>

          <div className="create-dialog-body-type-dialog">
            <button onClick={this.changeTypeDialog}>
              {dialogType ? <FontAwesomeIcon icon={faUsers} color={'#27ae60'} /> :
                <FontAwesomeIcon icon={faUser} color={'#27ae60'} />
              }
              <span>{dialogType ? `Create private chat` : `Create group chat`}</span>
            </button>
          </div>

          {dialogType && this.selectedUsers.length > 0 &&
            <div className="create-dialog-body-selected-users">
              {this.selectedUsers.map(elem => (
                this._renderSelectedUsers(elem)
              ))
              }
            </div>
          }

          {this.userNotFound ?
            <h5>Couldn't find user</h5> :
            <div className="create-dialog-body-users" style={{ height: `calc(100vh - ${calHeight}px)` }}>
              {
                this.listUsers.map((elem) => {
                  return (
                    this._renderUser(elem)
                  )
                })
              }
            </div>
          }

          {this.selectedUsers.length > 0 &&
            <div className="create-dialog-body-btn">
              <button onClick={this.createDialog}>Create grup</button>
            </div>
          }
        </div>
      </div>
    )
  }
}