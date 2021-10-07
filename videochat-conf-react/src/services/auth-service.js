import CryptoJS from 'crypto-js';
import ConnectyCube from 'connectycube';
class AuthService {

	constructor() {
		this.init();
	}


	logout = () =>{
		ConnectyCube.destroySession();
		
	};

	init = () =>{
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
	}
	login = (userName) => {
		ConnectyCube.createSession()
			.then((session) => {
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
			})
			.catch((error) => {});


		
			
	
	}




}
const Auth = new AuthService();
export default Auth;