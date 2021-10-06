
import { Route } from 'react-router';
import './App.scss';
import EnterName from './Components/EnterName/EnterName';
import Main from './Components/Main/Main';

function App(props) {

	return (
		<div className="wrapper">
			<header className="header">

			</header>
			<main className="main">
				<div className="page__main">
					<Route path="/" ><Main users={props.users} /></Route>
					<Route path="/enter">
						<EnterName />
					</Route>
				</div>
			</main>
			<footer>

			</footer>

		</div>
	);
}

export default App;
