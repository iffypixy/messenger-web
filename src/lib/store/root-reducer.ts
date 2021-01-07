import {combineReducers} from "redux";

import {themingReducer} from "@features/theming";
import {authReducer} from "@features/auth";
import {chatReducer} from "@features/chat";
import {profileReducer} from "@features/profile";

export const rootReducer = combineReducers({
  theming: themingReducer,
  auth: authReducer,
  chat: chatReducer,
  profile: profileReducer
});
