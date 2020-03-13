import React, { PureComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import './chatInput.css'

export default class ChatInput extends PureComponent {
  state = {
    messageText: ''
  }

  changeMessage = event => (this.setState({ messageText: event.target.value }))

  sendMessage = (e) => {
    e.preventDefault()
    this.props.sendMessage(this.state.messageText)
      .then(() => (this.setState({ messageText: '' })))
      .catch(() => (this.setState({ messageText: '' })))
  }

  pickAttachment = () => {
    alert('Coming soon')
  }

  render() {
    const { messageText } = this.state
    return (
      <footer>
        <form onSubmit={this.sendMessage}>
          <input
            type="text"
            value={messageText}
            onChange={this.changeMessage}
            placeholder="Write your message..."
            name="search" />
          <div className="chat-attachment">
            <FontAwesomeIcon icon={faPaperclip} color={'#9aa8b5'} onClick={this.pickAttachment} />
          </div>
          <button onClick={this.sendMessage}>
            <FontAwesomeIcon icon={faPaperPlane} color={'white'} />
          </button>
        </form>
      </footer>
    );
  }
}
