import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {GetDirectChatsResponse,} from "@api/direct-chats.api";
import {DirectChatMessage, DirectChat, DirectChatsListItem} from "./lib/typings";
import {
  AddMessagePayload, FetchChatData, FetchChatPayload,
  FetchMessagesData, FetchMessagesPayload, FetchSendingMessageData,
  FetchSendingMessagePayload
} from "./actions";
import * as actions from "./actions";

interface DirectsState {
  list: DirectChatsListItem[] | null;
  areChatsFetching: boolean;
  chats: {
    [key: string]: {
      messages: DirectChatMessage[];
      data: DirectChat | null;
      isFetching: boolean;
      areMessagesFetching: boolean;
    };
  };
}

export const reducer = createReducer<DirectsState>({
  chats: {},
  list: null,
  areChatsFetching: false
}, {
  [actions.fetchChats.pending.type]: (state) => {
    state.areChatsFetching = true;
  },

  [actions.fetchChats.fulfilled.type]: (state, {payload}: PayloadAction<GetDirectChatsResponse>) => {
    state.list = payload.chats;
    state.areChatsFetching = false;
  },

  [actions.fetchChats.rejected.type]: (state) => {
    state.areChatsFetching = false;
  },

  [actions.fetchChat.pending.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchChatData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat, isFetching: true
    };
  },

  [actions.fetchChat.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchChatPayload, string, {arg: FetchChatData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat,
      data: payload.chat,
      isFetching: false
    };
  },

  [actions.fetchChat.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchChatData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat, isFetching: false
    };
  },

  [actions.fetchMessages.pending.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchMessagesData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat, areMessagesFetching: true
    };
  },

  [actions.fetchMessages.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchMessagesPayload, string, {arg: FetchMessagesData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat,
      areMessagesFetching: false,
      messages: chat.messages ?
        [...payload.messages, ...chat.messages] : payload.messages
    };
  },

  [actions.fetchMessages.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchMessagesData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat, areMessagesFetching: false
    };
  },

  [actions.fetchSendingMessage.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchSendingMessagePayload, string, {arg: FetchSendingMessageData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat, messages: chat.messages &&
        chat.messages.map((msg) => msg.id === arg.messageId ? payload.message : msg)
    };
  },

  [actions.addMessage.type]: (state, {payload}: PayloadAction<AddMessagePayload>) => {
    const chat = state.chats[payload.partnerId] || {};

    state.chats[payload.partnerId] = {
      ...chat, messages: chat.messages ?
        [...chat.messages, payload.message] : [payload.message]
    };

    state.list = state.list && state.list.map((chat) => chat.partner.id === payload.partnerId ?
      ({...chat, lastMessage: payload.message}) : chat);
  }
});