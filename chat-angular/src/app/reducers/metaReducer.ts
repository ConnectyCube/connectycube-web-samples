import {Action, ActionReducer, INIT} from "@ngrx/store";
import {State} from "./index";
import {LOGOUT} from "./app.action";

export function logout(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action:Action) => {
    if ( action != null && action.type === LOGOUT) {
      return reducer( undefined, {type: INIT});
    }
    return reducer(state, action);
  };
}
