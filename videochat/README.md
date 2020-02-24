# Video Chat code sample for Browser for ConnectyCube platform

This README introduces [ConnectyCube](https://connectycube.com) Video Chat code sample for Browser

Project contains the following features implemented:

* User authorization
* 1-1 video calls
* Mute/unmute microphone
* Mute/unmute camera
* Video filters

## Documentation

ConnectyCube JS SDK getting started - [https://developers.connectycube.com/js](https://developers.connectycube.com/js)

ConnectyCube Video Chat API documentation - [https://developers.connectycube.com/js/videocalling](https://developers.connectycube.com/js/videocalling)

## Screenshots

<p align="center">
<img src="https://developers.connectycube.com/docs/_images/code_samples/js_codesample_videochat_demo.png" width="750" alt="Video Chat code sample demo image">
</p>

## Build your own Chat app

To make the sample works for your own app, please do the following:

1. Register new account and application at `https://admin.connectycube.com` and then put Application credentials from 'Overview' page into `config.js` file:

    ```javascript
	const CC_CREDENTIALS = {
	    'appId': 0,
	    'authKey': '',
	    'authSecret': ''
	};
    ```

2. At `https://admin.connectycube.com`, create from 2 to 4 users in 'Users' module and put them into `config.js` file:

	```javascript
	const CC_USERS = [
        {
          id: 0,
          login: "",
          password: ""
        },
        {
          id: 1,
          login: "",
          password: ""
        },
    ];
	```
3. (Optional) If you are at [Enterprise](https://connectycube.com/pricing/) plan - provide your API server and Chat server endpoints at `config.js` file to point the sample against your own server:

 	```javascript
	const CC_CONFIG = {
        endpoints: {
            api: "",
            chat: ""
        },
        ...
   };
	```
4. Run `index.html` and enjoy!
