import {createReducer, on} from '@ngrx/store';
import {addUser, updateUser, removeUser, removeAllUsers, addBitrateMicrophone} from "./participant.actions";

export interface User {
  id: number,
  name?: string,
  stream?: any,
  bitrate?: any
}

export interface participantState {
  participantArray: Array<User>;
}

export const initialState: participantState = {
  participantArray: []
};

export const participantReducer = createReducer(
    initialState,
    on(addUser, (state, {id, name, stream, bitrate}) => ({
      ...state,
      participantArray: state.participantArray.concat([{id, name, stream, bitrate}])
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
    on(addBitrateMicrophone, (state, {arr}) => ({
      ...state,
      participantArray: state.participantArray.map((user: User, index) => {
        console.warn(arr);
        if (index !== 0) {
          const newUser: User = {...user};
          newUser.bitrate = arr.find((item:any)=>item.id === user.id).bitrate;
          return newUser;
        }
        else {
          return user;
        }
      })
    }))
  )
;

