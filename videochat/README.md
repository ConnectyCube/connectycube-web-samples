# Video Chat code sample for Browser for ConnectyCube platform

This README introduces [ConnectyCube](https://connectycube.com) P2P Calling code sample for Web.

Project contains the following features implemented:

- User authorization
- Video calls up to 4 users
- Mute/unmute microphone
- Switch camera 
- Snack bars to notify users about changes
- Compatibility with the [React Native Video Chat code sample](https://github.com/ConnectyCube/connectycube-reactnative-samples/tree/master/RNVideoChat)

## Documentation

ConnectyCube JS SDK getting started - [https://developers.connectycube.com/js](https://developers.connectycube.com/js)

ConnectyCube P2P Calling API documentation - [https://developers.connectycube.com/js/videocalling](https://developers.connectycube.com/js/videocalling)

## Screenshots

<p align="center">
<img src="https://developers.connectycube.com/docs/_images/code_samples/javascript/js_codesample_videochat_login.png" width="720" alt="Video Chat code sample demo image login screen">
</p>

<p align="center">
<img src="https://developers.connectycube.com/docs/_images/code_samples/javascript/js_codesample_videochat_select_users.png" width="720" alt="Video Chat code sample demo image select users screen">
</p>

<p align="center">
<img src="https://developers.connectycube.com/docs/_images/code_samples/javascript/js_codesample_videochat_active_call.png" width="720" alt="Video Chat code sample demo image active call screen">
</p>

## Build your own VideoChat app

To make the sample works for your own app, please do the following:

1.  Register new account and application at `https://admin.connectycube.com` and then put Application credentials from 'Overview' page into `videochat/src/config.js` file:

    ```javascript
    export const credentials = {
      appId: 0,
      authKey: "",
      authSecret: ""
    };
    ```

2.  At `https://admin.connectycube.com`, create from 2 to 4 users in 'Users' module and put them into `videochat/src/config.js` file:

    ```javascript
    export const users = [
      {
        id: 0,
        name: "User1",
        login: "videouser1",
        password: "videouser1",
        color: "#34ad86"
      },
      {
        id: 1,
        name: "User2",
        login: "videouser2",
        password: "videouser2",
        color: "#077988"
      },
      {
        id: 2,
        name: "User3",
        login: "videouser3",
        password: "videouser3",
        color: "#13aaae"
      },
      {
        id: 3,
        name: "User4",
        login: "videouser4",
        password: "videouser4",
        color: "#056a96"
      }
    ];
    ```

3.  (Optional) If you are at [Enterprise](https://connectycube.com/pricing/) plan - provide your API server and Chat server endpoints at `videochat/src/config.js` file to point the sample against your own server:

    ```javascript
    {
       endpoints: {
           api: "",
           chat: ""
       },
       ...
    };
    ```

4.  Install node modules - `npm install`
5.  Run `npm run build` and open `dist/index.html`
6.  Or run `npm start` to start application in developing mode on `https://localhost:3000`
