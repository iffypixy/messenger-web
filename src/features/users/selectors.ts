import {RootState} from "@lib/store";

const usersState = (state: RootState) => state.users;

export const searching = (state: RootState) => usersState(state).searching;
export const isSearchingFetching = (state: RootState) => usersState(state).isSearchingFetching;