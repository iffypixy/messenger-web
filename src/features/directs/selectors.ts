import {RootState} from "@lib/typings";

const directsState = (state: RootState) => state.directs;

export const chats = (state: RootState) => directsState(state).chats;
export const chat = (state: RootState) => directsState(state).chat;
export const messages = (state: RootState) => directsState(state).messages;
export const areChatsFetching = (state: RootState) => directsState(state).areChatsFetching;
export const isChatFetching = (state: RootState) => directsState(state).isChatFetching;
export const areMessagesFetching = (state: RootState) => directsState(state).areMessagesFetching;