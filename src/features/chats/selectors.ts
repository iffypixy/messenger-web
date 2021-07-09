import {RootState} from "@lib/store";

const chatsState = (state: RootState) => state.chats;

export const search = (state: RootState) => chatsState(state).search;