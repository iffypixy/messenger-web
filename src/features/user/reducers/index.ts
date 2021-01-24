import {combineReducers} from "redux";

import {dataReducer} from "./data.reducer";

export const reducer = combineReducers({
  data: dataReducer
});