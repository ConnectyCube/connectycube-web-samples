# Conference Call code sample for Browser for ConnectyCube platform

This README introduces [ConnectyCube](https://connectycube.com) Conference Calling code sample for Web

Project contains the following features implemented:

- User authorization
- Video calls up to 4 users
- Mute/unmute microphone
- Mute/unmute video
- Switch camera
- Snack bars to notify users about changes
- Guest room mode up to 12 users
- Share screen

There is a LIVE demo available https://connectycube.github.io/connectycube-web-samples/videochat-conf/dist/

## Documentation

ConnectyCube JS SDK getting started - [https://developers.connectycube.com/js](https://developers.connectycube.com/js)

ConnectyCube Conference Calling API documentation - [https://developers.connectycube.com/js/videocalling-conference](https://developers.connectycube.com/js/videocalling-conference)

## Screenshots

<p align="center">
<img src="https://developers.connectycube.com/images/code_samples/javascript/js_conf_sample_login.png" width="720" alt="Conference Call code sample demo image login screen">
</p>


<p align="center">
<img src="https://developers.connectycube.com/images/code_samples/javascript/js_codesample_videochat_active_call.png" width="720"   alt="Conference Call code sample demo image active call screen">
</p>

## Build your own VideoChat app

To make the sample works for your own app, please do the following:

1.  Register new account and application at `https://admin.connectycube.com` and then put Application credentials from 'Overview' page into `videochat-conf/src/config.js` file:

    ```javascript
    const credentials = {
      appId: 111,
      authKey: "..."
    };
    ```

3.  Install node modules - `npm install`
4.  Run `npm run build` and open `dist/index.html`
5.  Or run `npm start` to start application in developing mode on `http://localhost:8000`

## Can't build yourself?

Got troubles with building code sample? Create an issue at [Issues page](https://github.com/ConnectyCube/connectycube-web-samples/issues)
