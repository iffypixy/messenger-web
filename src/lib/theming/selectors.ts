import {RootState} from "@lib/store";

const themingState = (state: RootState) => state.theming;

export const theme = (state: RootState) => themingState(state).theme;