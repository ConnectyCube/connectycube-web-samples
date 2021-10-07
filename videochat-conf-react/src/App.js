
import { Route } from 'react-router';
import './App.scss';
import Conference from './Components/Conference/Conference';
import EnterName from './Components/EnterName/EnterName';
import Main from './Components/Main/Main';

function App(props) {

	return (
		<div className="wrapper">
			<header className="header">

			</header>
			<main className="main">
				<div className="page__main">
					<Route exact path="/" ><Main/></Route>
					<Route path="/enter">
						<EnterName/>
					</Route>
					<Route path="/conference">
						<Conference participants={props.participants}/>
					</Route>
				</div>
			</main>
			<footer>

			</footer>

		</div>
	);
}

export default App;
