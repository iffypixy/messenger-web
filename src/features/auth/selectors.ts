import {AppState} from "redux";

const authSelector = (state: AppState) => state.auth;

export const isAuthenticatedSelector = (state: AppState) => authSelector(state).data.isAuthenticated;
export const credentialsSelector = (state: AppState) => authSelector(state).data.credentials;
export const areCredentialsFetching = (state: AppState) => authSelector(state).loading.areCredentialsFetching;