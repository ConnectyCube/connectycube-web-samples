import React, { PureComponent } from 'react'
import Avatar from '../../../helpers/avatar/avatar'
import ChatInput from './chatInput/chatInput'
import { connect } from 'react-redux'
import ChatService from '../../../services/chat-service'
import UsersService from '../../../services/users-service'
import { RecyclerListView, DataProvider } from "recyclerlistview/web"
import { ChatLayoutUtil } from '../../../helpers/LayoutUtil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import store from '../../../store'
import Loader from '../../../helpers/loader/loader'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import Message from './message/message'

import './chat.css'

class Chat extends PureComponent {
  scrollWidth = 0
  scrollHeight = 0
  listenerWindowSize = null
  timer = null
  isFetchingMsg = false
  messagesListRef = null
  listenerLazyLoad = false
  needToGetMoreMessage = null


  recycler_Y = 0
  contentHeight = 0
  contentNewOffset = 0

  constructor(props) {
    super(props)
    this.state = {
      isAlredy: true,
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }),
      layoutProvider: []
    }
    this.currentUserInfo = store.getState().currentUser.user
  }


  lazyLoadMessages = (elem, y) => {
    this.recycler_Y = y
    this.contentHeight = elem.nativeEvent.contentSize.height
    if (this.listenerLazyLoad && this.needToGetMoreMessage && y < 2000) {
      this.listenerLazyLoad = false
      ChatService.getMoreMessages(this.props.selectedDialog)
        .then(amountMessages => {
          amountMessages === 100 ? this.needToGetMoreMessage = true : this.needToGetMoreMessage = false
          this.listenerLazyLoad = true
        })
    }
  }

  getDialogInfo = async () => {
    const dialog = ChatService.getDialogById(this.props.selectedDialog.id)

    // get info about occupants
    await UsersService.getOccupants(dialog.occupants_ids)

    ChatService.getMessages(dialog)
      .catch(e => alert(`Error.\n\n${JSON.stringify(e)}`))
      .then(amountMessages => {
        amountMessages === 100 ? this.needToGetMoreMessage = true : this.needToGetMoreMessage = false
        this.setState({
          isFetchingMsg: true,
          layoutProvider: ChatLayoutUtil.getChatLayoutProvider({
            width: this.scrollWidth,
            dialogId: dialog.id,
            currentUserId: this.currentUserInfo.id
          }),
          dataProvider: this.state.dataProvider.cloneWithRows(this.props.messages[dialog.id])
        })
        this.scrollToBottom()
        this.listenerLazyLoad = true
      })
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.scrollWidth = document.getElementById('chat-body').clientWidth
    this.scrollHeight = document.getElementById('chat-body').clientHeight
    this.getDialogInfo()
  }

  componentDidUpdate(prewProps) {
    const dialog = ChatService.getDialogById(this.props.selectedDialog.id)
    if (prewProps.messages[dialog.id] &&
      prewProps.messages[dialog.id].length !== this.props.messages[dialog.id].length) {
      this.setState({
        dataProvider: this.state.dataProvider.cloneWithRows(this.props.messages[dialog.id])
      }, () => this.updateScrollPosition())
    }
  }

  updateScrollPosition = () => {
    const getElement = document.getElementById('chat-body').children[0].children[0].children[0].style.height
    const fullScrollHeight = getElement.slice(0, getElement.length - 2)
    const newOffset = this.recycler_Y + (fullScrollHeight - this.contentHeight)
    this.messagesListRef.scrollToOffset(0, newOffset)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    this.scrollWidth = document.getElementById('chat-body').clientWidth
    this.scrollHeight = document.getElementById('chat-body').clientHeight
    if (!this.timer) {
      const dialog = ChatService.getDialogById(this.props.selectedDialog.id)
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.timer = null
        this.setState({
          isAlredy: true,
          layoutProvider: ChatLayoutUtil.getChatLayoutProvider({
            width: this.scrollWidth,
            dialogId: dialog.id,
            currentUserId: this.currentUserInfo.id
          })
        })
      }, 500)
    }
  }

  sendMessage = async (messageText) => {
    const dialog = ChatService.getDialogById(this.props.selectedDialog.id)
    if (messageText.length <= 0) return
    await ChatService.sendMessage(dialog, messageText)
    this.scrollToBottom()
  }

  pickAttachment = () => {
    alert('Attachment')
  }

  goToSplashPage = () => {
    const { router } = this.props
    router('/home')
  }

  _renderMessage = (type, item) => {
    const { users } = this.props
    // 1 - current sender & 2 - other sender
    const whoIsSender = this.currentUserInfo.id === item.sender_id ? 1 : 2
    const participantInfo = whoIsSender === 2 ? users[item.sender_id] : null
    let notRenderAvatar = null

    if (type > 0 && whoIsSender !== 1 &&
      this.state.dataProvider._data[type - 1].sender !== item.sender) {
      notRenderAvatar = true
    }

    return (
      <Message
        whoIsSender={whoIsSender}
        message={item}
        participantInfo={participantInfo}
        notRenderAvatar={notRenderAvatar}
        widthScroll={this.scrollWidth}
      />
    )
  }

  getDialogById = () => {
    return ChatService.getDialogById(this.props.selectedDialog.id)
  }

  scrollToBottom = () => {
    if (this.messagesListRef) {
      this.messagesListRef.scrollToIndex(this.state.dataProvider._data.length - 1, false)
    }
  }

  render() {
    const { dataProvider, layoutProvider, isAlredy, isFetchingMsg } = this.state
    const { selectedDialog } = this.props
    let currentDialog

    if (selectedDialog) {
      currentDialog = this.getDialogById()
    }

    return (
      <div className="chat-container" >
        <header>
          {window.innerWidth < 768 &&
            <button onClick={this.goToSplashPage}>
              <FontAwesomeIcon icon={faChevronLeft} color={'#212529'} />
              Back
            </button>
          }
          <Avatar photo={currentDialog.photo} name={currentDialog.name} size={50} />
          <h3>{currentDialog.name}</h3>
        </header>
        <div className="chat-body" id="chat-body">
          {isAlredy && isFetchingMsg ?
            dataProvider._data.length > 0 &&
            <>
              <RecyclerListView
                style={{
                  width: this.scrollWidth,
                  height: this.scrollHeight,
                }}
                ref={ref => this.messagesListRef = ref}
                dataProvider={dataProvider}
                layoutProvider={layoutProvider}
                rowRenderer={this._renderMessage}
                onScroll={(elem, x, y) => {
                  this.lazyLoadMessages(elem, y)
                }}
              />
            </> : <Loader />
          }
        </div>
        <ChatInput sendMessage={this.sendMessage} />
      </div>
    )
  }
}

const mapStateToProps = ({ selectedDialog, dialogs, messages, users }) => ({
  selectedDialog,
  dialogs,
  messages,
  users
})

export default connect(mapStateToProps)(Chat)