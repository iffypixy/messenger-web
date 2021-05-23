import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {GetGroupChatMessagesResponse, GetGroupChatResponse, GetGroupChatsResponse} from "@api/group-chats.api";
import {GroupChatMessage, GroupChat, GroupChatsListItem} from "./lib/typings";
import * as actions from "./actions";

interface GroupsState {
  chats: GroupChatsListItem[] | null;
  chat: GroupChat | null;
  messages: GroupChatMessage[] | null;
  isChatFetching: boolean;
  areChatsFetching: boolean;
  areMessagesFetching: boolean;
}

export const reducer = createReducer<GroupsState>({
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

  [actions.fetchChats.fulfilled.type]: (state, {payload}: PayloadAction<GetGroupChatsResponse>) => {
    state.chats = payload.chats;
    state.areChatsFetching = false;
  },

  [actions.fetchChats.rejected.type]: (state) => {
    state.areChatsFetching = false;
  },

  [actions.fetchChat.pending.type]: (state) => {
    state.isChatFetching = true;
  },

  [actions.fetchChat.fulfilled.type]: (state, {payload}: PayloadAction<GetGroupChatResponse>) => {
    state.chat = payload.chat;
    state.isChatFetching = false;
  },

  [actions.fetchChat.rejected.type]: (state) => {
    state.isChatFetching = false;
  },

  [actions.fetchMessages.pending.type]: (state) => {
    state.areMessagesFetching = true;
  },

  [actions.fetchMessages.fulfilled.type]: (state, {payload}: PayloadAction<GetGroupChatMessagesResponse>) => {
    state.messages = payload.messages;
    state.areMessagesFetching = false;
  },

  [actions.fetchMessages.rejected.type]: (state) => {
    state.areMessagesFetching = false;
  }
});