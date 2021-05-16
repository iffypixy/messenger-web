import {createReducer} from "@reduxjs/toolkit";

import {Credentials} from "./lib/typings";
import * as actions from "./actions";

interface AuthState {
    credentials: Credentials | null;
    isAuthenticated: boolean;
}

export const reducer = createReducer<AuthState>(
    {
        credentials: null,
        isAuthenticated: true
    },
    {
      [actions.fetchLogin.fulfilled.type]: (state, payload) => {
        state.isAuthenticated = true;
      }
    }
);