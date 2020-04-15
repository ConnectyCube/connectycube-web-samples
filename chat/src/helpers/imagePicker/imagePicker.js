import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal'
import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage'
import './imagePicker.css'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    padding: 0,
    boxShadow: '2px 2px 25px 0px black'
  }
}

export default class ImagePicker extends Component {
  croppedAreaPixels = null
  cropedImage = null

  constructor(props) {
    super(props);

    this.state = {
      image: '',
      imageSrc: '',
      crop: { x: 0, y: 0 },
      zoom: 1,
      isModal: false
    }
  }

  onCropChange = crop => {
    this.setState({ crop })
  }

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.croppedAreaPixels = croppedAreaPixels
  }

  cropImage = async () => {
    this.cropedImage = await getCroppedImg(this.state.imageSrc, this.croppedAreaPixels)
    this.props.getImage(this.cropedImage.file)
    this.handleCloseModal()
  }

  onZoomChange = zoom => {
    this.setState({ zoom })
  }

  handleCloseModal = () => (this.setState({ isModal: false }))

  handleOpenModal = () => (this.setState({ isModal: true }))

  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({
        imageSrc: URL.createObjectURL(event.target.files[0]),
        isModal: true
      })
    }
  }

  _renderAvatarPicker = () => {
    return (
      <>
        <div className="image-picker">
          <label htmlFor="file-upload" className="custom-file-upload" >
            {this.cropedImage ?
              <img src={this.cropedImage?.link.url} alt="groupPhoto" style={{ width: 60, height: 60, borderRadius: '50%' }} /> :
              <FontAwesomeIcon icon={faCamera} color={'black'} />
            }
          </label>
          <input id="file-upload" type="file" onChange={this.onImageChange} />
        </div>
      </>
    )
  }

  _renderAttachmentPicker = () => {
    return (
      <div className="image-picker-container">
        <label htmlFor="file-upload" className="custom-file-upload-attachment" >
          <FontAwesomeIcon icon={faPaperclip} color={'#9aa8b5'} />
        </label>
        <input id="file-upload" type="file" onChange={this.onImageChange} />
      </div>
    )
  }

  render() {
    const { pickAsAttachment } = this.props
    const { isModal } = this.state
    return (
      <>
        {pickAsAttachment ?
          this._renderAttachmentPicker() :
          this._renderAvatarPicker()
        }
        <Modal
          isOpen={isModal}
          onRequestClose={this.handleCloseModal}
          ariaHideApp={false}
          style={customStyles}
          overlayClassName="Overlay"
        >
          <>
            <div className="image-crop-picker-header">
              <button onClick={this.cropImage}>Next</button>
              <button onClick={this.handleCloseModal}>Cancel</button>
            </div>
            <div className="image-crop-picker-container">
              <Cropper
                image={this.state.imageSrc}
                crop={this.state.crop}
                zoom={this.state.zoom}
                cropSize={{ width: 300, height: 300 }}
                onCropChange={this.onCropChange}
                onCropComplete={this.onCropComplete}
                onZoomChange={this.onZoomChange}
              />
            </div>
          </>
        </Modal>
      </>

    )
  }

}
