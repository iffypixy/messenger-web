import {RootState} from "@lib/store";
import {ID} from "@lib/typings";
import {fallback} from "./reducer";

const groupsSelector = (state: RootState) => state.groups;

export const chats = (state: RootState) => groupsSelector(state).list;
export const areChatsFetching = (state: RootState) => groupsSelector(state).areChatsFetching;

export const chat = (groupId: ID) => (state: RootState) => {
  const chat = groupsSelector(state).chats[groupId] || fallback;

  return chat.group;
};

export const messages = (groupId: ID) => (state: RootState) => {
  const chat = groupsSelector(state).chats[groupId] || fallback;

  return chat.messages;
};

export const isChatFetching = (groupId: ID) => (state: RootState) => {
  const chat = groupsSelector(state).chats[groupId] || fallback;

  return chat.isFetching;
};

export const areMessagesFetching = (groupId: ID) => (state: RootState) => {
  const chat = groupsSelector(state).chats[groupId] || fallback;

  return chat.areMessagesFetching;
};

export const areMessagesFetched = (groupId: ID) => (state: RootState) => {
  const chat = groupsSelector(state).chats[groupId] || fallback;

  return chat.areMessagesFetched;
};

export const areMessagesLeftToFetch = (groupId: ID) => (state: RootState) => {
  const chat = groupsSelector(state).chats[groupId] || fallback;

  return chat.areMessagesLeftToFetch;
};