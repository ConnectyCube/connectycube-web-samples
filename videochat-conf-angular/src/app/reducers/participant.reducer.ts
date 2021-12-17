import {createReducer, on} from '@ngrx/store';
import {
  addUser,
  updateUser,
  removeUser,
  removeAllUsers,
  addMicrophoneLevel,
  addBitrate,
  updateConnectionStatus, updateVideoStatus, updateName, addActiveSpeaker
} from "./participant.actions";

export interface User {
  me?: boolean
  id: number,
  name?: string,
  stream?: any,
  volumeLevel?: number,
  bitrate?: string,
  connectionStatus?: string,
  videoStatus?: boolean | string,
  isActiveSpeaker?: boolean
}

export interface participantState {
  participantArray: Array<User>;
}


export const initialState: participantState = {
  participantArray: []
};

export const participantReducer = createReducer(
    initialState,
    on(addUser, (state, {me, id, name, stream, volumeLevel, bitrate, connectionStatus, videoStatus}) => ({
      ...state,
      participantArray: state.participantArray.concat([{
        me, id, name, stream, volumeLevel,
        bitrate, connectionStatus, videoStatus
      }])
    })),
    on(removeUser, (state, {id}) => ({
      ...state,
      participantArray: state.participantArray.filter(item => {
        return item.id !== id;
      })
    })),
    on(updateUser, (state, {id, stream}) => ({
        ...state,
        participantArray: id === 77777 ?
          state.participantArray.map((item) => {
            if (item.me) {
              return {...item, stream};
            }
            return item;
          })
          : state.participantArray.map((item) => {
            if (item.id === id) {
              return {...item, stream};
            }
            return item;
          })
      })
    ),
    on(removeAllUsers, (state) => ({
      ...state,
      participantArray: []
    })),
    on(addMicrophoneLevel, (state, {idVolumeLevelMap}) => ({
      ...state,
      participantArray: state.participantArray.map((user: User, index: number) => {
        if (user.volumeLevel !== undefined) {
          const newUser: User = {...user};
          newUser.volumeLevel = idVolumeLevelMap.get(user.id);
          console.log(`User-${index} volume: `, newUser.volumeLevel);
          return newUser;
        }
        else {
          return user;
        }
      })
    })),
    on(addActiveSpeaker, (state, {id}) => ({
      ...state,
      participantArray: state.participantArray.map((user: User) => {
        console.error(id);
        const newUser: User = {...user};
        newUser.isActiveSpeaker = user.id === id;
        return newUser;
      })
    })),
    on(addBitrate, (state, {idBitrateMap}) => ({
      ...state,
      participantArray: state.participantArray.map((user: User, index: number) => {
        console.log(idBitrateMap)
        if (user.bitrate !== undefined) {
          const newUser: User = {...user};
          newUser.bitrate = idBitrateMap.get(user.id);
          console.log(`User-${index} bitrate: `, newUser.bitrate);
          return newUser;
        }
        else {
          return user;
        }
      })
    })),
    on(updateConnectionStatus, (state, {id, connectionStatus}) => ({
      ...state,
      participantArray: state.participantArray.map((user: User) => {
        if (user.id === id) {
          const newUser = {...user};
          newUser.connectionStatus = connectionStatus;
          return newUser;
        }
        return user;
      })
    })),
    on(updateVideoStatus, (state, {id, videoStatus}) => ({
      ...state,
      participantArray: id === 77777 ?
        state.participantArray.map((user: User) => {
          if (user.me) {
            console.warn("updateVideoStatus__REDUX")
            const newUser = {...user};
            newUser.videoStatus = videoStatus;
            return newUser;
          }
          return user;
        })
        : state.participantArray.map((user: User) => {
          if (user.id === id) {
            console.warn("updateVideoStatus__REDUX", id)
            const newUser = {...user};
            newUser.videoStatus = videoStatus;
            return newUser;
          }
          return user;
        })
    })),
    on(updateName, (state, {id, name}) => ({
      ...state,
      participantArray: state.participantArray.map((user: User) => {
        if (user.id === id) {
          const newUser = {...user};
          newUser.name = name;
          return newUser;
        }
        return user;
      })
    }))
  )
;

