import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {IUser} from "@api/auth.api";
import * as actions from "../actions";

interface InitialState {
  credentials: IUser | null;
  isAuthenticated: boolean;
}

export const dataReducer = createReducer<InitialState>(
  {
    isAuthenticated: false,
    credentials: null
  },
  {
    [actions.fetchCredentials.fulfilled.type]: (state, {payload}: PayloadAction<{credentials: IUser}>) => {
      state.credentials = payload.credentials;
      state.isAuthenticated = true;
    },

    [actions.fetchRegister.fulfilled.type]: (state, {payload}: PayloadAction<{credentials: IUser}>) => {
      state.credentials = payload.credentials;
      state.isAuthenticated = true;
    },

    [actions.fetchLogin.fulfilled.type]: (state, {payload}: PayloadAction<{credentials: IUser}>) => {
      state.credentials = payload.credentials;
      state.isAuthenticated = true;
    },

    [actions.fetchLogout.fulfilled.type]: (state) => {
      state.isAuthenticated = false;
      state.credentials = null;
    }
  }
);