import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {SetSearchingPayload} from "./actions";
import * as actions from "./actions";

interface ChatsState {
  search: string;
}

export const reducer = createReducer<ChatsState>(
  {
    search: ""
  },
  {
    [actions.setSearching.type]: (state, {payload}: PayloadAction<SetSearchingPayload>) => {
      state.search = payload.search;
    }
  }
);