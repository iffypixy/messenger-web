import {RootState} from "@lib/typings";

const chatsState = (state: RootState) => state.chats;

export const search = (state: RootState) => chatsState(state).search;