import {RootState} from "@lib/store";
import {ID} from "@lib/typings";
import {fallback} from "./reducer";

const directsState = (state: RootState) => state.directs;

export const chats = (state: RootState) => directsState(state).list;

export const areChatsFetching = (state: RootState) => directsState(state).areChatsFetching;

export const chat = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || fallback;

  return chat.direct;
};

export const isChatFetching = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || fallback;

  return chat.isFetching;
};

export const messages = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || fallback;

  return chat.messages;
};

export const areMessagesFetching = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || fallback;

  return chat.areMessagesFetching;
};

export const areMessagesFetched = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || fallback;

  return chat.areMessagesFetched;
};

export const areMessagesLeftToFetch = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || fallback;

  return chat.areMessagesLeftToFetch;
};

export const attachedImages = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || fallback;

  return chat.images;
};

export const areAttachedImagesFetching = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || fallback;

  return chat.areImagesFetching;
};

export const attachedFiles = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || fallback;

  return chat.files;
};

export const areAttachedFilesFetching = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || fallback;

  return chat.areFilesFetching;
};

export const attachedAudios = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || fallback;

  return chat.audios;
};

export const areAttachedAudiosFetching = (partnerId: ID) => (state: RootState) => {
  const chat = directsState(state).chats[partnerId] || fallback;

  return chat.areAudiosFetching;
};