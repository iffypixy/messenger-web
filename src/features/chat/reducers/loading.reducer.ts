import {createReducer, Reducer} from "@reduxjs/toolkit";

import * as actions from "../actions";

interface InitialState {
  areQueriedUsersFetching: boolean;
}

export const loadingReducer: Reducer<InitialState> = createReducer<InitialState>(
  {
    areQueriedUsersFetching: false
  },
  {
    [actions.fetchQueriedUsers.pending.type]: (state) => {
      state.areQueriedUsersFetching = true;
    },

    [actions.fetchQueriedUsers.fulfilled.type]: (state) => {
      state.areQueriedUsersFetching = false;
    },

    [actions.fetchQueriedUsers.rejected.type]: (state) => {
      state.areQueriedUsersFetching = false;
    }
  }
);