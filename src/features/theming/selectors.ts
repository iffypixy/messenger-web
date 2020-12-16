import {AppState} from "redux";

export const themeSelector = (state: AppState) => state.theming.data.theme;