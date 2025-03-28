# Chat code sample for Angular for ConnectyCube platform

This README introduces [ConnectyCube](https://connectycube.com) Chat code sample for Web

Project contains the following features implemented:

- User Login / SignUp / Logout
- Chat dialogs creation
- 1-1 messaging
- Group messaging
- Users search
- Typing statuses
- Sent / Read statuses
- Last seen
- User / Group profile
- Virtual Scroll

## Documentation

ConnectyCube JS SDK getting started - [https://developers.connectycube.com/js](https://developers.connectycube.com/js)

ConnectyCube Messaging API documentation - [https://developers.connectycube.com/js/messaging](https://developers.connectycube.com/js/messaging)

## Screenshots

<p align="center">
<img src="https://developers.connectycube.com/images/code_samples/javascript/js_codesample_chat_angular1.png" width="1374" alt="Conference Call code sample demo image active call screen">
</p>

## Build your own Chat app

To make the sample works for your own app, please do the following:

1. Run `cp .env.example .env`;
2. Register new account at `https://connectycube.com/signup/`;
3. Then go to Admin panel, create Application and  put Application credentials from 'Overview' page into `src/environments/environment.ts` file;
4. Install node modules - `npm install`;
5. Run `npm run start` and open `http://localhost:4200`.

## Can't build yourself?

Got troubles with building code sample? Create an issue at [Issues page](https://github.com/ConnectyCube/connectycube-web-samples/issues)
