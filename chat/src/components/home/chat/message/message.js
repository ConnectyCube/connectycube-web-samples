import React, { Component } from 'react';
import { getTime } from '../../../../helpers/lastDate'
import Avatar from '../../../../helpers/avatar/avatar'
import { GetMaxWidthMsg } from '../../../../helpers/LayoutUtil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import MessageSendState from './messageStatus'
import Modal from 'react-modal'
import './message.css'

export default class Message extends Component {
  // 1 - current & 2 - other
  constructor(props) {
    super(props)
    this.state = {
      isModal: false
    }
  }

  selectedImg = null

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

  _renderAsStr = (whoIsSender) => {
    const { message } = this.props
    if (whoIsSender === 1) {
      return (
        <>
          <span style={{ wordWrap: 'break-word' }}>{message.body}</span>
          <div className="chat-message-right-footer">
            <span>
              <>
                {getTime(message.date_sent)}
              </>
              <>
                {<MessageSendState send_state={message.send_state} />}
              </>
            </span>
          </div>
        </>
      )
    } else {
      return (
        <>
          <span style={{ wordWrap: 'break-word' }}>{message.body}</span>
          <div className="chat-message-left-footer">
            <span>{getTime(message.date_sent)}</span>
          </div>
        </>
      )
    }
  }

  renderZoomImg = (event, message) => {
    event.preventDefault()
    this.selectedImg = message.attachment[0]
    this.setState({ isModal: true })
  }

  handleCloseModal = () => this.setState({ isModal: false })

  _renderAsAttachment = () => {
    const { message, whoIsSender } = this.props
    return (
      <>
        <div className="chat-message-container-attachment">
          <div style={{
            backgroundImage: `url(${message.attachment[0].url})`,
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
            border: '1px solid #cbcbcb',
            cursor: 'pointer'
          }}
            onClick={(e) => this.renderZoomImg(e, message)}
          />
        </div>
        {whoIsSender === 1 ?
          <div className="chat-message-right-footer">
            <span>
              <>
                {getTime(message.date_sent)}
              </>
              <>
                {<MessageSendState send_state={message.send_state} />}
              </>
            </span>
          </div> :
          <div className="chat-message-left-footer">
            <span>{getTime(message.date_sent)}</span>
          </div>
        }
      </>
    )
  }

  render() {
    const { message, whoIsSender, participantInfo, notRenderAvatar, widthScroll } = this.props
    const { isModal } = this.state
    const withMsg = new GetMaxWidthMsg(widthScroll)

    return (
      <>
        {isModal &&
          <Modal
            isOpen={isModal}
            onRequestClose={this.handleCloseModal}
            ariaHideApp={false}
            style={this.customStyles}
            overlayClassName="overlay-chat-attachment"
          >
            <div className="active-window-modal-attachment">
              <FontAwesomeIcon icon={faTimesCircle} color={'white'} onClick={this.handleCloseModal} />
              <img
                src={this.selectedImg.url}
                width={this.selectedImg.width}
                height={this.selectedImg.height}
                alt="zoomImg"
              />
            </div>
          </Modal>
        }
        <div className="chat-message-layout">
          {whoIsSender === 1 ?
            <div className="chat-message-wrap chat-message-wrap-right">
              <div style={{ maxWidth: `${withMsg.currentSender}px` }} className="chat-message-container-position-right">
                {message.attachment ?
                  this._renderAsAttachment(1) :
                  this._renderAsStr(1)
                }
              </div>
            </div> :
            <div className="chat-message-wrap chat-message-wrap-left">
              <div className="chat-message-avatar">
                {notRenderAvatar &&
                  <Avatar photo={participantInfo.avatar} name={participantInfo.name || participantInfo.full_name} size={30} />
                }
              </div>
              <div style={{ maxWidth: `${message.attachment ? withMsg.otherSender + 60 : withMsg.otherSender}px` }} className="chat-message-container-position-left">
                {message.attachment ?
                  this._renderAsAttachment(2) :
                  this._renderAsStr(2)
                }
              </div>
            </div>
          }
        </div>
      </>
    )
  }
}
