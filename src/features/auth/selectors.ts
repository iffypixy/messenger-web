import {RootState} from "@lib/store";

const stateSelector = (state: RootState) => state.auth;

export const credentials = (state: RootState) => stateSelector(state).credentials;
export const isAuthenticated = (state: RootState) => stateSelector(state).isAuthenticated;
export const areCredentialsFetching = (state: RootState) => stateSelector(state).areCredentialsFetching;