import {AppState} from "redux";

export const themeSelector = (state: AppState) => state.themingState.data.theme;