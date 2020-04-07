import React, { Component } from 'react';
import { getTime } from '../../../../helpers/lastDate'
import Avatar from '../../../../helpers/avatar/avatar'
import { GetMaxWidthMsg } from '../../../../helpers/LayoutUtil'
import './message.css'

export default class Message extends Component {
  // 1 - current & 2 - other
  render() {
    const { message, whoIsSender, participantInfo, notRenderAvatar, widthScroll } = this.props
    const withMsg = new GetMaxWidthMsg(widthScroll)
    return (
      <div className="chat-message-layout">
        {whoIsSender === 1 ?
          <div className="chat-message-wrap chat-message-wrap-right">
            <div style={{ maxWidth: `${withMsg.currentSender}px` }} className="chat-message-container-position-right">
              <span style={{ wordWrap: 'break-word' }}>{message.body}</span>
              <div className="chat-message-right-footer">
                <span>{getTime(message.date_sent)}</span>
              </div>
            </div>
          </div> :
          <div className="chat-message-wrap chat-message-wrap-left">
            <div className="chat-message-avatar">
              {notRenderAvatar &&
                <Avatar photo={participantInfo.avatar} name={participantInfo.name || participantInfo.full_name} size={30} />
              }
            </div>
            <div style={{ maxWidth: `${withMsg.otherSender}px` }} className="chat-message-container-position-left">
              <span style={{ wordWrap: 'break-word' }}>{message.body}</span>
              <div className="chat-message-left-footer">
                <span>{getTime(message.date_sent)}</span>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
