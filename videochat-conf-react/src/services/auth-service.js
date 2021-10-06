import CryptoJS from 'crypto-js';
import ConnectyCube from 'connectycube';
class AuthService {
	// $generateLogin = () => {

	// 	return new_username;
	// }
	$enterName = () => {
		const credentials = {
			appId: 5497,
			authKey: "BxHxMLzGJjQsLAL",
			authSecret: "cXmO7AaYQK5BQ-t"
		}
		const appConfig = {
			debug: {
				mode: 1
			},
		}
		ConnectyCube.init(credentials, appConfig)

		ConnectyCube.createSession()
			.then((session) => {})
			.catch((error) => {});


		setTimeout(() => {
			let userName = prompt("Input user name", "Vasek")
			// let userName="Vasek"
			if (!userName) {
				ConnectyCube.destroySession().catch((error) => {});
			} else {
				if (localStorage.getItem("userName") === userName) {
					const userCredentials = {
						login: localStorage.getItem("userLogin"),
						password: localStorage.getItem("userPass")
					};
					ConnectyCube.login(userCredentials)
						.then((user) => {})
						.catch((error) => {});

				} else {
					let rug = require('random-username-generator');
					let new_username = rug.generate();
					const userProfile = {
						login: new_username,
						password: CryptoJS.MD5(new_username).toString(),
						full_name: userName
					}
					console.log(userProfile.password)
					ConnectyCube.users
						.signup(userProfile)
						.then((user) => {
							localStorage.setItem('userName', userName)
							localStorage.setItem('userPass', userProfile.password)
							localStorage.setItem('userLogin', userProfile.login)
							const userCredentials = {
								login: localStorage.getItem("userLogin"),
								password: localStorage.getItem("userPass")
							};
							ConnectyCube.login(userCredentials)
								.then((user) => {})
								.catch((error) => {});
						})
						.catch((error) => {
							console.log("We have such nickname")
						});
				}
			}
		}, 800);
	}




}
const Auth = new AuthService();
export default Auth;