import {combineReducers} from "@reduxjs/toolkit";

import {dataReducer} from "./data.reducer";
import {loadingReducer} from "./loading.reducer";

export const reducer = combineReducers({
    data: dataReducer,
    loading: loadingReducer
});