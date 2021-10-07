import './Main.scss';
import AuthService from '../../services/auth-service';
import { NavLink } from 'react-router-dom';


const Main = (props) => {
	const onLogin = () =>{
		let userName = prompt("Enter ur name", "Vasek")
		AuthService.login(userName)
	}
	return (
		<div className='container'>
			<div className="img__container">
				<img src="./img/logo.png" alt="" />

			</div>
			

			<NavLink to="/conference" className='join' onClick={onLogin}>Join room as guest</NavLink>

		</div>
	)
}

export default Main;