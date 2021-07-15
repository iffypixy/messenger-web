import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {User} from "@features/users";
import * as actions from "./actions";
import {FetchSearchingUsersPayload} from "./actions";

interface UsersState {
  searching: User[];
  isSearchingFetching: boolean;
}

export const reducer = createReducer<UsersState>(
  {
    searching: [],
    isSearchingFetching: false
  },
  {
    [actions.fetchSearchingUsers.pending.type]: (state) => {
      state.isSearchingFetching = true;
    },

    [actions.fetchSearchingUsers.fulfilled.type]: (state, {payload}: PayloadAction<FetchSearchingUsersPayload>) => {
      state.searching = payload.users;
      state.isSearchingFetching = false;
    },

    [actions.fetchSearchingUsers.rejected.type]: (state) => {
      state.isSearchingFetching = false;
    },
  }
);