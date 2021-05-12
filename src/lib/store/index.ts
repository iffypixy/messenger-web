import {combineReducers, createStore} from "@reduxjs/toolkit";

import {authReducer} from "@features/auth";
import {themingReducer} from "@lib/theming";

export const rootReducer = combineReducers({
    theming: themingReducer,
    auth: authReducer
});

export const store = createStore(rootReducer);