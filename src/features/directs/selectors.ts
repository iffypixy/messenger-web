import {ID, RootState} from "@lib/typings";

const directsState = (state: RootState) => state.directs;

export const chats = (state: RootState) => directsState(state).list;
export const areChatsFetching = (state: RootState) => directsState(state).areChatsFetching;

export const chat = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || null;

  return chat && chat.data;
};

export const isChatFetching = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return !!chat && chat.isFetching;
};

export const areMessagesFetching = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return !!chat && chat.areMessagesFetching;
};

export const messages = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || null;

  return chat && chat.messages;
};

export const scroll = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || null;

  return chat && chat.scroll;
};

export const areMessagesFetched = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return !!chat && !!chat.areMessagesFetched;
};

export const areMessagesLeftToFetch = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return !!chat && !!chat.areMessagesLeftToFetch;
};