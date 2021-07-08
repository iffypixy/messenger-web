import {ID, RootState} from "@lib/typings";

const directsState = (state: RootState) => state.directs;

export const chats = (state: RootState) => directsState(state).list;

export const areChatsFetching = (state: RootState) => directsState(state).areChatsFetching;

export const chat = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return chat?.chat || null;
};

export const isChatFetching = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return !!chat && (chat.isFetching || false);
};

export const messages = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return chat?.messages || null;
};

export const areMessagesFetching = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return chat?.areMessagesFetching || false;
};

export const areMessagesFetched = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return chat?.areMessagesFetched || false;
};

export const scroll = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return chat?.scroll || null;
};

export const areMessagesLeftToFetch = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return !chat?.areMessagesLeftToFetch;
};

export const images = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return chat?.images || [];
};

export const areImagesFetching = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return chat?.areImagesFetching || false;
};

export const files = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return chat?.files || [];
};

export const areFilesFetching = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return chat?.areFilesFetching || false;
};

export const audios = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return chat?.audios || [];
};

export const areAudiosFetching = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId];

  return chat?.areAudiosFetching || false;
};