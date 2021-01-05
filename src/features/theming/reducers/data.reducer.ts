import {createReducer, Reducer} from "@reduxjs/toolkit";

import * as actions from "../actions";

type Theme = "light" | "dark";

interface InitialState {
  theme: Theme;
}

export const dataReducer: Reducer<InitialState> = createReducer<InitialState>(
  {
    theme: "light"
  },
  {
    [actions.setTheme.type]: (state, {payload}) => {
      state.theme = payload.theme;
    }
  }
);