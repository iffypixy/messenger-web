import {createReducer} from "@reduxjs/toolkit";

import * as actions from "../actions";

type Theme = "light" | "dark";

interface State {
  theme: Theme;
}

export const dataReducer = createReducer<State>(
  {
    theme: "dark"
  },
  {
    [actions.setTheme.type]: (state: State, {payload}) => {
      state.theme = payload.theme;
    }
  }
);