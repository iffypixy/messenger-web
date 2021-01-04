import {createReducer, Reducer} from "@reduxjs/toolkit";

import * as actions from "../actions";

interface InitialState {
  areNewUsersFetching: boolean;
}

export const loadingReducer: Reducer<InitialState> = createReducer<InitialState>(
  {
    areNewUsersFetching: false
  },
  {
    [actions.fetchNewUsers.pending.type]: (state) => {
      state.areNewUsersFetching = true;
    },

    [actions.fetchNewUsers.fulfilled.type]: (state) => {
      state.areNewUsersFetching = false;
    },

    [actions.fetchNewUsers.rejected.type]: (state) => {
      state.areNewUsersFetching = false;
    }
  }
);