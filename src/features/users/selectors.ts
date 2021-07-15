import {RootState} from "@lib/store";

const usersState = (state: RootState) => state.users;

export const searching = (state: RootState) => usersState(state).searching;