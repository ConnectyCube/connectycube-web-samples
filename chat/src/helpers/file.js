import ConnectyCube from 'connectycube'

export function getImageLinkFromUID(uid) {
  if (!uid) {
    return null
  }
  return ConnectyCube.storage.privateUrl(uid)
}


export function preparationAttachment(file) {
  return {
    size: file.size,
    uid: file.uid,
    type: file.content_type,
    name: file.name,
    width: 400,
    height: 400
  }
}
