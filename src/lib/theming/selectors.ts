import {RootState} from "@lib/typings";

const stateSelector = (state: RootState) => state.theming;

export const theme = (state: RootState) => stateSelector(state).theme;