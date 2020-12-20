import {createReducer} from "@reduxjs/toolkit";

import * as actions from "../actions";

interface InitialState {
  isRegisterFetching: boolean;
  isLogoutFetching: boolean;
  areCredentialsFetching: boolean;
}

export const loadingReducer = createReducer<InitialState>(
  {
    isRegisterFetching: false,
    isLogoutFetching: false,
    areCredentialsFetching: true
  },
  {
    [actions.fetchCredentials.pending.type]: (state) => {
      state.areCredentialsFetching = true;
    },

    [actions.fetchCredentials.fulfilled.type]: (state) => {
      state.areCredentialsFetching = false;
    },

    [actions.fetchCredentials.rejected.type]: (state) => {
      state.areCredentialsFetching = false;
    },

    [actions.fetchRegister.pending.type]: (state) => {
      state.isRegisterFetching = true;
    },

    [actions.fetchRegister.fulfilled.type]: (state) => {
      state.isRegisterFetching = false;
    },

    [actions.fetchRegister.rejected.type]: (state) => {
      state.isRegisterFetching = false;
    },

    [actions.fetchLogin.pending.type]: (state) => {
      state.isRegisterFetching = true;
    },

    [actions.fetchLogin.fulfilled.type]: (state) => {
      state.isRegisterFetching = false;
    },

    [actions.fetchLogin.rejected.type]: (state) => {
      state.isRegisterFetching = false;
    },

    [actions.fetchLogout.pending.type]: (state) => {
      state.isLogoutFetching = true;
    },

    [actions.fetchLogout.fulfilled.type]: (state) => {
      state.isLogoutFetching = false;
    },

    [actions.fetchLogout.rejected.type]: (state) => {
      state.isLogoutFetching = false;
    }
  }
);