import react from 'react';
import UserCam from '../UserCam/UserCam';
import './Conference.scss';
import AuthService from '../../services/auth-service';
import { NavLink } from 'react-router-dom';

const Conference = (props) => {
	let inputClass = react.createRef();
	let turningOff = () => {
		let btn = document.getElementById(inputClass.current.id)
		debugger
		btn.classList.toggle("mute")
	}
	return (
		<div className='conference'>
			<div className="users__cams">
				<UserCam/>
				
			</div>
			<div className="user__buttons">
				<button id="micro__btn"  className="call__btn micro__btn"><img src='./img/mic.svg' alt="Micro" /></button>
				<button id="video_btn"   className="call__btn video__btn"><img src='./img/video.svg' alt="Video" /></button>
				<NavLink to="/" id="end__btn"  onClick={AuthService.logout} className="call__btn end__btn"><img src='./img/call_end.svg' alt="Call end" /></NavLink>
				<button id="switch__btn"   className="call__btn switch__btn"><img src='./img/switch_video.svg' alt="Switch" /></button>
				<button id="share__btn"   className="call__btn share__btn"><img src='./img/share.svg' alt="Share" /></button>
			</div>
			

			
		</div>
	)
}

export default Conference;