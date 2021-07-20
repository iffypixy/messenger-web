import {createReducer} from "@reduxjs/toolkit";

import * as actions from "./actions";

interface ProfilesState {
  isUpdatingProfileFetching: boolean;
}

export const reducer = createReducer<ProfilesState>({
  isUpdatingProfileFetching: false
}, {
  [actions.fetchUpdatingProfile.pending.type]: (state) => {
    state.isUpdatingProfileFetching = true;
  },

  [actions.fetchUpdatingProfile.fulfilled.type]: (state) => {
    state.isUpdatingProfileFetching = false;
  },

  [actions.fetchUpdatingProfile.rejected.type]: (state) => {
    state.isUpdatingProfileFetching = false;
  }
});