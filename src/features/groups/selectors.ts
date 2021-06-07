import {ID, RootState} from "@lib/typings";

const groupsSelector = (state: RootState) => state.groups;

export const chats = (state: RootState) => groupsSelector(state).chats;
export const messages = (state: RootState) => groupsSelector(state).messages;
export const areChatsFetching = (state: RootState) => groupsSelector(state).areChatsFetching;
export const isChatFetching = (state: RootState) => groupsSelector(state).isChatFetching;
export const areMessagesFetching = (state: RootState) => groupsSelector(state).areMessagesFetching;
export const saved = (state: RootState) => groupsSelector(state).saved;
export const chat = (id: ID) => (state: RootState) =>
  saved(state).find((chat) => chat.id === id) || groupsSelector(state).chat;