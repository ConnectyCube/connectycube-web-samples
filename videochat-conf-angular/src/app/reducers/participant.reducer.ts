import {createReducer, on} from '@ngrx/store';
import {addUser, updateUser, removeUser} from "./participant.actions";

export interface User {
  id: number,
  name?: string,
  stream?: any
}

export interface participantState {
  participantArray: Array<User>;
}

export const initialState: participantState = {
  participantArray: []
};

export const participantReducer = createReducer(
  initialState,
  on(addUser, (state, {id, name, stream}) => ({
    ...state,
    participantArray: state.participantArray.concat([{id, name, stream}])
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
  )
);

