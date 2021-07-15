import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {SetSearchPayload} from "./actions";
import * as actions from "./actions";

interface ChatsState {
  search: string;
}

export const reducer = createReducer<ChatsState>(
  {
    search: ""
  },
  {
    [actions.setSearch.type]: (state, {payload}: PayloadAction<SetSearchPayload>) => {
      state.search = payload.search;
    }
  }
);