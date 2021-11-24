import {createReducer, on} from '@ngrx/store';
import {
  addUser,
  updateUser,
  removeUser,
  removeAllUsers,
  addMicrophoneLevel,
  addBitrate,
  updateConnectionStatus
} from "./participant.actions";

export interface User {
  id: number,
  name?: string,
  stream?: any,
  volumeLevel?: number,
  bitrate?: string,
  connectionStatus?: string
}

export interface participantState {
  participantArray: Array<User>;
}

export const initialState: participantState = {
  participantArray: []
};

export const participantReducer = createReducer(
    initialState,
    on(addUser, (state, {id, name, stream, volumeLevel, bitrate, connectionStatus}) => ({
      ...state,
      participantArray: state.participantArray.concat([{id, name, stream, volumeLevel, bitrate, connectionStatus}])
    })),
    on(removeUser, (state, {id}) => ({
      ...state,
      participantArray: state.participantArray.filter(item => item.id !== id)
    })),
    on(updateUser, (state, {id, stream}) => ({
        ...state,
        participantArray: state.participantArray.map((item) => {
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
    }))
  )
;

