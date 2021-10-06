import './Main.scss';
import AuthService from '../../services/auth-service';


const Main = (props) => {
	
	let usersArr = props.users.map((u) => {

		return (

			<a key={u.id} href="#s" className={`login__btn ${u.name}`}><span>Login as {u.name}</span></a>
		)
	})
	return (
		<div className='container'>

			<div className='users__container'>
				{usersArr}
			</div>

			<button href="#s" className='join' onClick={AuthService.$enterName}>Join room as guest</button>

		</div>
	)
}

export default Main;