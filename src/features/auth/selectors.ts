import {RootState} from "@lib/typings";

const stateSelector = (state: RootState) => state.auth;

export const credentials = (state: RootState) => stateSelector(state).credentials;

export const isAuthenticated = (state: RootState) => stateSelector(state).isAuthenticated;