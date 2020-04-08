import React, { PureComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import ImagePicker from '../../../../helpers/imagePicker/imagePicker'
import './chatInput.css'

export default class ChatInput extends PureComponent {
  state = {
    messageText: ''
  }

  changeMessage = event => (this.setState({ messageText: event.target.value }))

  sendMessage = (e) => {
    e.preventDefault()
    this.props.sendMessageCallback(this.state.messageText)
      .then(() => (this.setState({ messageText: '' })))
      .catch(() => (this.setState({ messageText: '' })))
  }

  getImage = (image) => {
    this.props.sendMessageCallback(this.state.messageText, image)
      .then(() => (this.setState({ messageText: '' })))
      .catch(() => (this.setState({ messageText: '' })))
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
            <ImagePicker pickAsAttachment getImage={this.getImage} />
          </div>
          <button onClick={this.sendMessage}>
            <FontAwesomeIcon icon={faPaperPlane} color={'white'} />
          </button>
        </form>
      </footer>
    );
  }
}
