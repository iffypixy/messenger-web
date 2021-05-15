import {combineReducers} from "@reduxjs/toolkit";

import {authReducer} from "@features/auth";
import {themingReducer} from "@lib/theming";

export const rootReducer = combineReducers({
  theming: themingReducer,
  auth: authReducer
});