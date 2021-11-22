import {createReducer, on} from '@ngrx/store';
import {addUser, updateUser, removeUser, removeAllUsers, addBitrateMicrophone, swapUsers} from "./participant.actions";

export interface User {
  id: number,
  name?: string,
  stream?: any,
  bitrate?: number
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
    on(addBitrateMicrophone, (state, {idBitrateMap}) => ({
      ...state,
      participantArray: state.participantArray.map((user: User, index) => {
        if (index !== 0) {
          const newUser: User = {...user};
          newUser.bitrate = idBitrateMap.get(user.id);
          console.log(newUser.bitrate);
          return newUser;
        }
        else {
          return user;
        }
      })
    })),
    on(swapUsers, (state, {index}) => {
      const newArray = [...state.participantArray];
      [newArray[0],newArray[index]] = [newArray[index],newArray[0]]
      return {
        ...state,
        participantArray: newArray
      }
    }),
  )
;

