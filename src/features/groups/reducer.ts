import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {GetGroupChatsResponse} from "@api/group-chats.api";
import {GroupChatMessage, GroupChat, GroupChatsListItem} from "./lib/typings";
import {
  AddMessagePayload,
  FetchChatData,
  FetchChatPayload,
  FetchMessagesData,
  FetchMessagesPayload,
  SetScrollPayload
} from "./actions";
import * as actions from "./actions";

interface GroupsState {
  list: GroupChatsListItem[] | null;
  areChatsFetching: boolean;
  chats: {
    [key: string]: {
      messages: GroupChatMessage[];
      data: GroupChat | null;
      isFetching: boolean;
      areMessagesFetching: boolean;
      scroll: number;
    };
  };
}

export const reducer = createReducer<GroupsState>({
  chats: {},
  areChatsFetching: false,
  list: null
}, {
  [actions.fetchChats.pending.type]: (state) => {
    state.areChatsFetching = true;
  },

  [actions.fetchChats.fulfilled.type]: (state, {payload}: PayloadAction<GetGroupChatsResponse>) => {
    state.list = payload.chats;
    state.areChatsFetching = false;
  },

  [actions.fetchChats.rejected.type]: (state) => {
    state.areChatsFetching = false;
  },

  [actions.fetchChat.pending.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchChatData}>) => {
    const chat = state.chats[arg.groupId] || {};

    state.chats[arg.groupId] = {
      ...chat, isFetching: true
    };
  },

  [actions.fetchChat.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchChatPayload, string, {arg: FetchChatData}>) => {
    const chat = state.chats[arg.groupId] || {};

    state.chats[arg.groupId] = {
      ...chat,
      data: payload.chat,
      isFetching: false
    };
  },

  [actions.fetchChat.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchChatData}>) => {
    const chat = state.chats[arg.groupId] || {};

    state.chats[arg.groupId] = {
      ...chat, isFetching: false
    };
  },

  [actions.fetchMessages.pending.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchMessagesData}>) => {
    const chat = state.chats[arg.groupId] || {};

    state.chats[arg.groupId] = {
      ...chat, areMessagesFetching: true
    };
  },

  [actions.fetchMessages.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchMessagesPayload, string, {arg: FetchMessagesData}>) => {
    const chat = state.chats[arg.groupId] || {};

    state.chats[arg.groupId] = {
      ...chat,
      messages: chat.messages ?
        [...payload.messages, ...chat.messages] : payload.messages,
      areMessagesFetching: false
    };
  },

  [actions.fetchMessages.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchMessagesData}>) => {
    const chat = state.chats[arg.groupId] || {};

    state.chats[arg.groupId] = {
      ...chat, areMessagesFetching: false
    };
  },

  [actions.addMessage.type]: (state, {payload}: PayloadAction<AddMessagePayload>) => {
    const chat = state.chats[payload.groupId] || {};

    state.chats[payload.groupId] = {
      ...chat, messages: chat.messages ?
        [...chat.messages, payload.message] : [payload.message]
    };

    state.list = state.list && state.list.map((chat) => chat.id === payload.groupId ?
      ({...chat, lastMessage: payload.message}) : chat);
  },

  [actions.setScroll.type]: (state, {payload}: PayloadAction<SetScrollPayload>) => {
    const chat = state.chats[payload.groupId] || {};

    state.chats[payload.groupId] = {
      ...chat, scroll: payload.scroll
    };
  }
});