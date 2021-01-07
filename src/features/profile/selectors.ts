import {AppState} from "redux";

const profileSelector = (state: AppState) => state.profile;

export const isUpdateProfileFetchingSelector = (state: AppState) => profileSelector(state).loading.isUpdateProfileFetching;