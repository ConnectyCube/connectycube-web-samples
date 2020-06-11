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

The sample provides 2 mods:
  - Calling mode, with call/accept/reject signals
  - Guest Room modde, where any user can join a call by link. To create a guest room you can click on a 'Guest Room' button and then share an url with other users. 
  
There is a live demo working in a 'Guest Room' mode available https://teatalk.connectycube.com

## Documentation

ConnectyCube JS SDK getting started - [https://developers.connectycube.com/js](https://developers.connectycube.com/js)

ConnectyCube Conference Calling API documentation - [https://developers.connectycube.com/js/videocalling-conference](https://developers.connectycube.com/js/videocalling-conference)

## Screenshots

<p align="center">
<img src="https://developers.connectycube.com/docs/_images/code_samples/javascript/js_conf_sample_login.png" width="720" alt="Conference Call code sample demo image login screen">
</p>


<p align="center">
<img src="https://developers.connectycube.com/docs/_images/code_samples/javascript/js_codesample_videochat_active_call.png" width="720"   alt="Conference Call code sample demo image active call screen">
</p>

## Build your own VideoChat app

To make the sample works for your own app, please do the following:

1.  Register new account and application at `https://admin.connectycube.com` and then put Application credentials from 'Overview' page into `videochat-conf/src/config.js` file:

    ```javascript
    const credentials = {
      appId: 0,
      authKey: "",
      authSecret: ""
    };
    ```

2.  At `https://admin.connectycube.com`, create from 2 to 4 users in 'Users' module and put them into `videochat-conf/src/config.js` file:

    ```javascript
    const users = [
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

## Can't build yourself?

Got troubles with building React Native code sample? Just create an issue at [Issues page](https://github.com/ConnectyCube/connectycube-web-samples/issues) - we will create the sample for you. For FREE!
