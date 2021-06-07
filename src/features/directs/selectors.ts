import {ID, RootState} from "@lib/typings";

const directsState = (state: RootState) => state.directs;

export const chats = (state: RootState) => directsState(state).chats;
export const messages = (state: RootState) => directsState(state).messages;
export const areChatsFetching = (state: RootState) => directsState(state).areChatsFetching;
export const isChatFetching = (state: RootState) => directsState(state).isChatFetching;
export const areMessagesFetching = (state: RootState) => directsState(state).areMessagesFetching;
export const saved = (state: RootState) => directsState(state).saved;
export const chat = (partnerId: ID) => (state: RootState) =>
  saved(state).find((chat) => chat.partner.id === partnerId) || directsState(state).chat;