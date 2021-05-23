import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {GetDirectChatMessagesResponse, GetDirectChatResponse, GetDirectChatsResponse} from "@api/direct-chats.api";
import {DirectChatMessage, DirectChat, DirectChatsListItem} from "./lib/typings";
import * as actions from "./actions";

interface DirectsState {
  chats: DirectChatsListItem[] | null;
  chat: DirectChat | null;
  messages: DirectChatMessage[] | null;
  isChatFetching: boolean;
  areChatsFetching: boolean;
  areMessagesFetching: boolean;
}

export const reducer = createReducer<DirectsState>({
  chat: null,
  chats: null,
  messages: null,
  isChatFetching: false,
  areChatsFetching: false,
  areMessagesFetching: false
}, {
  [actions.fetchChats.pending.type]: (state) => {
    state.areChatsFetching = true;
  },

  [actions.fetchChats.fulfilled.type]: (state, {payload}: PayloadAction<GetDirectChatsResponse>) => {
    state.chats = payload.chats;
    state.areChatsFetching = false;
  },

  [actions.fetchChats.rejected.type]: (state) => {
    state.areChatsFetching = false;
  },

  [actions.fetchChat.pending.type]: (state) => {
    state.isChatFetching = true;
  },

  [actions.fetchChat.fulfilled.type]: (state, {payload}: PayloadAction<GetDirectChatResponse>) => {
    state.chat = payload.chat;
    state.isChatFetching = false;
  },

  [actions.fetchChat.rejected.type]: (state) => {
    state.isChatFetching = false;
  },

  [actions.fetchMessages.pending.type]: (state) => {
    state.areMessagesFetching = true;
  },

  [actions.fetchMessages.fulfilled.type]: (state, {payload}: PayloadAction<GetDirectChatMessagesResponse>) => {
    state.messages = payload.messages;
    state.areMessagesFetching = false;
  },

  [actions.fetchMessages.rejected.type]: (state) => {
    state.areMessagesFetching = false;
  }
});