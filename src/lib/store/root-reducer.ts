import {combineReducers} from "redux";

import {themingReducer} from "@features/theming";
import {authReducer} from "@features/auth";

export const rootReducer = combineReducers({
  theming: themingReducer,
  auth: authReducer
});