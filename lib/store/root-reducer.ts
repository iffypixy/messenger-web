import {combineReducers} from "redux";

import {themingReducer} from "@features/theming";

export const rootReducer = combineReducers({
  themingState: themingReducer
});