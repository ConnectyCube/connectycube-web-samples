import './Main.scss';
import AuthService from '../../services/auth-service';
import { NavLink } from 'react-router-dom';


const Main = (props) => {
	const onLogin = () =>{
		let userName = prompt("Enter ur name", "Vasek")
		AuthService.login(userName)
	}
	let usersArr = props.users.map((u) => {

		return (

			<a key={u.id} href="#s" className={`login__btn ${u.name}`}><span>Login as {u.name}</span></a>
		)
	})
	return (
		<div className='container'>
			<div className="img__container">
				<img src="./img/logo.png" alt="" />

			</div>
			<div className='users__container'>
				{usersArr}
			</div>

			<NavLink to="/conference" className='join' onClick={onLogin}>Join room as guest</NavLink>

		</div>
	)
}

export default Main;