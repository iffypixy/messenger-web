import {RootState} from "@lib/typings";

const usersState = (state: RootState) => state.users;

export const searched = (state: RootState) => usersState(state).searched;