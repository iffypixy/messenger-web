import {createReducer} from "@reduxjs/toolkit";

import {Credentials} from "./lib/typings";

interface AuthState {
    credentials: Credentials | null;
    isAuthenticated: boolean;
}

export const reducer = createReducer<AuthState>(
    {
        credentials: null,
        isAuthenticated: false
    },
    {

    }
);