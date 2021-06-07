import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {GetGroupChatMessagesResponse, GetGroupChatResponse, GetGroupChatsResponse} from "@api/group-chats.api";
import {GroupChatMessage, GroupChat, GroupChatsListItem} from "./lib/typings";
import {AddGroupMessageData, UpdateGroupMessageData} from "./actions";
import * as actions from "./actions";

interface GroupsState {
  chats: GroupChatsListItem[] | null;
  chat: GroupChat | null;
  messages: GroupChatMessage[] | null;
  isChatFetching: boolean;
  areChatsFetching: boolean;
  areMessagesFetching: boolean;
  saved: GroupChat[];
}

export const reducer = createReducer<GroupsState>({
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

    state.saved = [...state.saved, payload.chat].filter((saved, idx, array) =>
      idx === array.findIndex((chat) => chat.id === saved.id));
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
  },

  [actions.addMessage.type]: (state, {payload}: PayloadAction<AddGroupMessageData>) => {
    if (state.messages) state.messages.push(payload.message);
  },

  [actions.updateMessage.type]: (state, {payload}: PayloadAction<UpdateGroupMessageData>) => {
    if (state.messages) state.messages = state.messages
      .map((msg) => msg.id === payload.id ? ({...msg, ...payload.message}) : msg);
  }
});