import ConnectyCube from 'connectycube'

export function getImageLinkFromUID(uid) {
  if (!uid) {
    return null
  }
  return ConnectyCube.storage.privateUrl(uid)
}