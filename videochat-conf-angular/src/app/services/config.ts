export const CREDENTIALS = {
  appId: 5574,
  authKey: "TZU3fqTqdJPzhDB",
  authSecret: "hacNUHLEbOtXHYJ",
};

export const appConfig = {
  debug: {mode: 1},
  conference: {server: 'wss://janus.connectycube.com:8989'},
}

export const mediaParams = {
  audio: true,
  video: true
};

export const constraints = {
  video: {
    width: 1280,
    height: 720,
    frameRate: { ideal: 25, max: 30 },
  },
  audio: true,
};
export const localConstraints = {
  video: {
    width: 1280,
    height: 720,
    frameRate: { ideal: 25, max: 30 },
  },
  audio: false,
};

