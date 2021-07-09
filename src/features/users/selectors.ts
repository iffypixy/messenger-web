import {RootState} from "@lib/store";

const usersState = (state: RootState) => state.users;

export const searched = (state: RootState) => usersState(state).searched;