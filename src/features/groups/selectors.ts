import {ID, RootState} from "@lib/typings";

const groupsSelector = (state: RootState) => state.groups;

export const chats = (state: RootState) => groupsSelector(state).list;
export const areChatsFetching = (state: RootState) => groupsSelector(state).areChatsFetching;

export const chat = (groupId: ID) => (state: RootState) => {
  const chat = groupsSelector(state).chats[groupId] || null;

  return chat && chat.data;
};

export const messages = (groupId: ID) => (state: RootState) => {
  const chat = groupsSelector(state).chats[groupId] || null;

  return chat && chat.messages;
};

export const isChatFetching = (groupId: ID) => (state: RootState) => {
  const chat = groupsSelector(state).chats[groupId];

  return !!chat && chat.isFetching;
};

export const areMessagesFetching = (groupId: ID) => (state: RootState) => {
  const chat = groupsSelector(state).chats[groupId];

  return !!chat && chat.areMessagesFetching;
};

export const scroll = (groupId: ID) => (state: RootState) => {
  const chat = groupsSelector(state).chats[groupId] || null;

  return chat && chat.scroll;
};

export const areMessagesFetched = (groupId: ID) => (state: RootState) => {
  const chat = groupsSelector(state).chats[groupId];

  return !!chat && !!chat.areMessagesFetched;
};

export const areMessagesLeftToFetch = (groupId: ID) => (state: RootState) => {
  const chat = groupsSelector(state).chats[groupId];

  return !!chat && !!chat.areMessagesLeftToFetch;
};