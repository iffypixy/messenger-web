import {createReducer, PayloadAction, Reducer} from "@reduxjs/toolkit";

import {ID} from "@api/common";
import * as actions from "../actions";

interface InitialState {
  onlineUsersIds: ID[];
}

export const dataReducer: Reducer<InitialState> = createReducer<InitialState>(
  {
    onlineUsersIds: []
  },
  {
    [actions.setOnlineUsersIds.type]: (state, {payload}: PayloadAction<{usersIds: ID[]}>) => {
      state.onlineUsersIds = payload.usersIds;
    }
  }
);