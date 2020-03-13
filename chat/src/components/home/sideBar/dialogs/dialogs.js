import React, { PureComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { RecyclerListView, DataProvider } from "recyclerlistview/web"
import { connect } from 'react-redux'
import { DialogLayoutUtil } from '../../../../helpers/LayoutUtil'
import ChatService from '../../../../services/chat-service'
import Loader from '../../../../helpers/loader/loader'
import lastDate from '../../../../helpers/lastDate'
import Avatar from '../../../../helpers/avatar/avatar'
import './dialogs.css'


class Dialog extends PureComponent {
  scrollWidth = 0
  scrollHeight = 0
  listenerWindowSize = null
  timer = null
  allDialog = []

  constructor(props) {
    super(props)
    this.state = {
      isAlredy: false,
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }),
      layoutProvider: 0,
      count: 20,
      isLoader: true,
      search: ''
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.scrollWidth = document.getElementById('dialog-info-container').clientWidth
    this.scrollHeight = document.getElementById('dialog-info-container').clientHeight

    ChatService.fetchDialogsFromServer().then((dialogs) => {
      this.allDialog = dialogs
      this.setState({
        isAlredy: true,
        isLoader: false,
        layoutProvider: DialogLayoutUtil.getDialogLayoutProvider(this.scrollWidth),
        dataProvider: this.state.dataProvider.cloneWithRows(dialogs),
      })
    })
  }

  componentDidUpdate(prevProps) {
    const { dialogs } = this.props
    if (this.props.dialogs.length !== prevProps.dialogs.length) {
      this.allDialog = dialogs
      this.setState({
        layoutProvider: DialogLayoutUtil.getDialogLayoutProvider(this.scrollWidth),
        dataProvider: this.state.dataProvider.cloneWithRows(dialogs),
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    this.scrollWidth = document.getElementById('dialog-info-container').clientWidth
    this.scrollHeight = document.getElementById('dialog-info-container').clientHeight
    if (!this.timer) {
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.timer = null
        this.setState({
          isAlredy: true,
          layoutProvider: DialogLayoutUtil.getDialogLayoutProvider(this.scrollWidth)
        })
      }, 500)
    }
  }

  changeSearch = (event) => {
    let dialogs = []
    if (event.target.value === '') {
      dialogs = this.allDialog
    } else {
      this.allDialog.forEach(elem => {
        const str = elem.name.toUpperCase().includes(event.target.value.toUpperCase())
        str && dialogs.push(elem)
      })
    }
    this.setState({
      search: event.target.value,
      dataProvider: this.state.dataProvider.cloneWithRows(dialogs)
    })
  }

  goToChat = (item) => {
    const { router } = this.props
    ChatService.selectDialog(item)
    router('/home/chat')
  }

  createNewDialog = () => {
    const { router } = this.props
    router('/home/create-dialog')
  }

  _renderDialog = (type, item) => {
    return (
      <li onClick={() => this.goToChat(item)}>
        <div className="dialog-wrap-avatar">
          <Avatar photo={item.photo} name={item.name} size={50} />
        </div>
        <div className="dialog-wrap-block">
          <div className="dialog-wrap-block-left">
            <h5>{item.name}</h5>
            <span>{item.last_message === '' ? "No messages yet" : item.last_message}</span>
          </div>
          <div className="dialog-wrap-block-right">
            <p>{lastDate({
              lastDate: item.last_message_date_sent,
              lastMessage: item.last_message,
              updatedDate: item.updated_date,
            })}</p>
            {item.unread_messages_count > 0 &&
              <span>{item.unread_messages_count}</span>
            }
          </div>
        </div>
      </li>
    )
  }

  render() {
    const { isLoader, dataProvider, layoutProvider, search } = this.state
    return (
      <div className="dialog-container" >
        <button onClick={this.createNewDialog}>
          <FontAwesomeIcon icon={faUserPlus} color={'#d2d2d2'} />
          <span>New chat</span>
        </button>
        <div className="dialog-input-search">
          <div className="dialog-input-search-icon">
            <FontAwesomeIcon icon={faSearch} color={'#d2d2d2'} />
          </div>
          <input
            className="input-field"
            type="text"
            value={search}
            onChange={this.changeSearch}
            required
            placeholder="Search chats..."
            name="search" />
        </div>
        <div className="dialog-info-container" id="dialog-info-container">
          {isLoader ?
            (
              <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                <Loader />
              </div>
            ) : dataProvider.length === 0 ?
              <div className="dialog-no-chats">
                <h3>No chats yet</h3>
              </div> : this.state.isAlredy ?
                dataProvider._data.length > 0 ?
                  <ul>
                    {
                      <RecyclerListView
                        style={{ width: this.scrollWidth, height: this.scrollHeight }}
                        dataProvider={dataProvider}
                        layoutProvider={layoutProvider}
                        rowRenderer={this._renderDialog}
                      />
                    }
                  </ul> : <div className="dialog-no-chats">
                    <h3>No results</h3>
                  </div> : null
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ dialogs }) => ({
  dialogs
})

export default connect(mapStateToProps)(Dialog)