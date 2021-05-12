import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import * as actions from "./actions";

type Theme = "light" | "dark";

interface ThemingState {
    theme: Theme;
}

export const reducer = createReducer<ThemingState>(
    {
        theme: "dark"
    },
    {
        [actions.toggleTheme.type]: (state) => {
            state.theme = state.theme === "dark" ? "light" : "dark";
        },
        [actions.changeTheme.type]: (state, {payload}: PayloadAction<{theme: Theme}>) => {
            state.theme = payload.theme;
        }
    }
);