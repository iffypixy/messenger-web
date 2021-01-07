import {createReducer, Reducer} from "@reduxjs/toolkit";

import * as actions from "../actions";

interface InitialState {
  isUpdateProfileFetching: boolean;
}

export const loadingReducer: Reducer<InitialState> = createReducer<InitialState>(
  {
    isUpdateProfileFetching: false
  },
  {
    [actions.fetchUpdateProfile.pending.type]: (state) => {
      state.isUpdateProfileFetching = true;
    },

    [actions.fetchUpdateProfile.fulfilled.type]: (state) => {
      state.isUpdateProfileFetching = false;
    },

    [actions.fetchUpdateProfile.rejected.type]: (state) => {
      state.isUpdateProfileFetching = false;
    }
  }
);