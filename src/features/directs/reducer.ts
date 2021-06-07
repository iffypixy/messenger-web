import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {GetDirectChatMessagesResponse, GetDirectChatResponse, GetDirectChatsResponse} from "@api/direct-chats.api";
import {DirectChatMessage, DirectChat, DirectChatsListItem} from "./lib/typings";
import {AddDirectMessageData, UpdateDirectMessageData} from "./actions";
import * as actions from "./actions";

interface DirectsState {
  chats: DirectChatsListItem[] | null;
  chat: DirectChat | null;
  messages: DirectChatMessage[] | null;
  isChatFetching: boolean;
  areChatsFetching: boolean;
  areMessagesFetching: boolean;
  saved: DirectChat[];
}

export const reducer = createReducer<DirectsState>({
  chat: null,
  chats: null,
  messages: null,
  isChatFetching: false,
  areChatsFetching: false,
  areMessagesFetching: false,
  saved: []
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

    state.saved = [...state.saved, payload.chat].filter((saved, idx, array) =>
      idx === array.findIndex((chat) => chat.id === saved.id)
    );
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
  },

  [actions.addMessage.type]: (state, {payload}: PayloadAction<AddDirectMessageData>) => {
    if (state.messages) state.messages.push(payload.message);
  },

  [actions.updateMessage.type]: (state, {payload}: PayloadAction<UpdateDirectMessageData>) => {
    if (state.messages) state.messages = state.messages
      .map((msg) => msg.id === payload.id ? ({...msg, ...payload.message}) : msg);
  }
});