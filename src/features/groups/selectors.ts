import {RootState} from "@lib/typings";

const groupsSelector = (state: RootState) => state.groups;

export const chats = (state: RootState) => groupsSelector(state).chats;
export const chat = (state: RootState) => groupsSelector(state).chat;
export const messages = (state: RootState) => groupsSelector(state).messages;
export const areChatsFetching = (state: RootState) => groupsSelector(state).areChatsFetching;
export const isChatFetching = (state: RootState) => groupsSelector(state).isChatFetching;
export const areMessagesFetching = (state: RootState) => groupsSelector(state).areMessagesFetching;