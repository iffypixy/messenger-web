import {combineReducers} from "redux";

import {dataReducer} from "./data.reducer";
import {loadingReducer} from "./loading.reducer";

export const reducer = combineReducers({
  data: dataReducer,
  loading: loadingReducer
});