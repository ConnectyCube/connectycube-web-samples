import './Main.scss';
import ConnectyCube from 'connectycube';



const Main = (props) => {
	const credentials = {
		appId: 5497,
		authKey: "BxHxMLzGJjQsLAL",
		authSecret: "cXmO7AaYQK5BQ-t"
	}

	const MULTIPARTY_SERVER_ENDPOINT = 'wss://janus.connectycube:8989';

	const appConfig = {
		debug: { mode: 1 },
		conference: { server: MULTIPARTY_SERVER_ENDPOINT },
	}
	ConnectyCube.init(credentials, appConfig)



	let usersArr = props.users.map((u) => {

		return (

			<a key={u.id} href="#s" className={`login__btn ${u.name}`}><span>Login as {u.name}</span></a>
		)
	})

	let enterName = () => {

		const userCredentials = { login: "noblessem", password: "14anamoz" };

		ConnectyCube.createSession()
			.then((session) => { })
			.catch((error) => { });


		setTimeout(() => {
			let userName = prompt("Input user name", "Vasek")
			// let userName="Vasek"
			if (userName === null) {
				console.log("Null")
				ConnectyCube.destroySession().catch((error) => { });

			}
			else {
				
					if (localStorage.userName === userName) {
							
						const userCredentials = { login: localStorage.getItem("user"), password:localStorage.getItem("userPass")};
						ConnectyCube.login(userCredentials)
						.then((user) => {})
						.catch((error) => {});
						
					}
					else {
						let rug = require('random-username-generator');
						var new_username = rug.generate();
						const userProfile = {
							login: new_username,
							password: "qwertyu",
							full_name: userName
						}
						ConnectyCube.users
						.signup(userProfile)
						.then((user) => { })
						.catch((error) => {
							console.log("We have such nickname")
						});
						localStorage.setItem('userName', userName)
						localStorage.setItem('userPass', userProfile.password)
						
						ConnectyCube.login(userCredentials)
						.then((user) => {})
						.catch((error) => {});
						
					}
				
				
			

			}
		}

			, 800);



	}
	return (
		<div className='container'>

			<div className='users__container'>
				{usersArr}
			</div>

			<button href="#s" className='join' onClick={enterName}>Join room as guest</button>

		</div>
	)
}

export default Main;