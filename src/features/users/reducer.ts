import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {User} from "@features/users";
import * as actions from "./actions";
import {FetchSearchingUsersPayload} from "./actions";

interface UsersState {
  searched: User[] | null;
  areSearchingFetching: boolean;
}

export const reducer = createReducer<UsersState>(
  {
    searched: null,
    areSearchingFetching: false
  },
  {
    [actions.fetchSearchingUsers.pending.type]: (state) => {
      state.areSearchingFetching = true;
    },

    [actions.fetchSearchingUsers.fulfilled.type]: (state, {payload}: PayloadAction<FetchSearchingUsersPayload>) => {
      state.searched = payload.users;
      state.areSearchingFetching = false;
    },

    [actions.fetchSearchingUsers.rejected.type]: (state) => {
      state.areSearchingFetching = false;
    },
  }
);