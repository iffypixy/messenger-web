import {RootState} from "@lib/store";

const profilesState = (state: RootState) => state.profiles;

export const isUpdatingProfileFetching = (state: RootState) => profilesState(state).isUpdatingProfileFetching;