import {combineReducers} from "@reduxjs/toolkit";

import {authReducer} from "@features/auth";
import {directsReducer} from "@features/directs";
import {groupsReducer} from "@features/groups";
import {themingReducer} from "@lib/theming";

export const rootReducer = combineReducers({
  theming: themingReducer,
  auth: authReducer,
  directs: directsReducer,
  groups: groupsReducer
});