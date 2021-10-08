import ConnectyCube from 'connectycube';

class CallService {
	createAndJoinMeeting = (user) => {
		const params = {
			name: "My meeting",
			attendees: [
				{ id: user.id }
			],
			record: false,
			chat: false
		};
		ConnectyCube.meeting.create(params)
			.then(meeting => {
				const confRoomId = btoa(meeting._id)
				console.log(confRoomId)
				window.history.replaceState({}, 'Conference Guest Room', `/join/${confRoomId}`)
				const session = ConnectyCube.videochatconference.createNewSession()
				const mediaParams = {
					audio: true,
					video: true,
					options: {
						muted: true,
						mirror: true
					}
				};
				session.join(confRoomId, user.id, user.Name)
					.then(() => {
						const confRoomId = session.currentRoomId
						console.log("HERE is " + confRoomId)

					})
					.catch(error => { })
				session
					.getUserMedia(mediaParams)
					.then(localStream => {
						session.attachMediaStream('user__cam', localStream);
					})
					.catch(error => {
						console.log(error)
					})
			})
			.catch(error => {
				console.log(error)
			});
	}
}

const Call = new CallService();
export default Call