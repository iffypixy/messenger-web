import {combineReducers} from "redux";

import {loadingReducer} from "./loading.reducer";

export const reducer = combineReducers({
  loading: loadingReducer
});