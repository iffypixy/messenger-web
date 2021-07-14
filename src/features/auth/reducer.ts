import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {GetCredentialsResult, LoginResult, RegisterResult} from "@api/auth.api";
import {Credentials} from "./lib/typings";
import * as actions from "./actions";

interface AuthState {
  credentials: Credentials | null;
  isAuthenticated: boolean;
  areCredentialsFetching: boolean;
  isLoginFetching: boolean;
  isRegisterFetching: boolean;
}

export const reducer = createReducer<AuthState>(
  {
    credentials: null,
    isAuthenticated: false,
    areCredentialsFetching: true,
    isRegisterFetching: false,
    isLoginFetching: false
  },
  {
    [actions.fetchLogin.pending.type]: (state) => {
      state.isLoginFetching = true;
    },

    [actions.fetchLogin.fulfilled.type]: (state, {payload}: PayloadAction<LoginResult>) => {
      state.isAuthenticated = true;
      state.isLoginFetching = false;
      state.credentials = payload.credentials;
    },

    [actions.fetchLogin.rejected.type]: (state) => {
      state.isLoginFetching = false;
    },

    [actions.fetchRegister.pending.type]: (state) => {
      state.isRegisterFetching = true;
    },

    [actions.fetchRegister.fulfilled.type]: (state, {payload}: PayloadAction<RegisterResult>) => {
      state.isAuthenticated = true;
      state.isRegisterFetching = false;
      state.credentials = payload.credentials;
    },

    [actions.fetchRegister.rejected.type]: (state) => {
      state.isRegisterFetching = false;
    },

    [actions.fetchCredentials.pending.type]: (state) => {
      state.areCredentialsFetching = true;
    },

    [actions.fetchCredentials.fulfilled.type]: (state, {payload}: PayloadAction<GetCredentialsResult>) => {
      state.isAuthenticated = true;
      state.credentials = payload.credentials;
      state.areCredentialsFetching = false;
    },

    [actions.fetchCredentials.rejected.type]: (state) => {
      state.areCredentialsFetching = false;
    }
  }
);