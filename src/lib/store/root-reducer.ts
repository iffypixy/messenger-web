import {combineReducers} from "redux";

import {themingReducer} from "@features/theming";
import {authReducer} from "@features/auth";
import {chatReducer} from "@features/chat";

export const rootReducer = combineReducers({
  theming: themingReducer,
  auth: authReducer,
  chat: chatReducer
});
