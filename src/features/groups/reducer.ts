import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {GetGroupChatsResponse} from "@api/group-chats.api";
import {GroupChatMessage, GroupChat, GroupChatsListItem} from "./lib/typings";
import {
  AddMessagePayload,
  FetchChatData,
  FetchChatPayload,
  FetchMessagesData,
  FetchMessagesPayload, ReadMessagePayload, SetNumberOfUnreadMessagesPayload,
  SetScrollPayload, UpdateMessagePayload
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
      areMessagesFetched: boolean;
      areMessagesLeftToFetch: boolean;
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
      areMessagesFetching: false,
      areMessagesFetched: true,
      areMessagesLeftToFetch: !!payload.messages.length,
      messages: chat.messages ? [...payload.messages, ...chat.messages]
        : payload.messages
    };
  },

  [actions.fetchMessages.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchMessagesData}>) => {
    const chat = state.chats[arg.groupId] || {};

    state.chats[arg.groupId] = {
      ...chat, areMessagesFetching: false
    };
  },

  [actions.readMessage.type]: (state, {payload}: PayloadAction<ReadMessagePayload>) => {
    const chat = state.chats[payload.groupId] || {};

    const idx = chat.messages && chat.messages
      .findIndex((message) => message.id === payload.messageId);

    state.chats[payload.groupId] = {
      ...chat,
      messages: chat.messages && chat.messages
        .map((message, index) => idx >= index ? ({...message, isRead: true}) : message)
    };

    state.list = state.list && state.list.map((chat) => {
      const isCurrent = chat.id === payload.groupId &&
        (chat.lastMessage && chat.lastMessage.id) === payload.messageId;

      if (isCurrent) return ({
        ...chat, lastMessage: {
          ...chat.lastMessage!, isRead: true
        }
      });

      return chat;
    });
  },

  [actions.addMessage.type]: (state, {payload}: PayloadAction<AddMessagePayload>) => {
    const chat = state.chats[payload.groupId] || {};

    state.chats[payload.groupId] = {
      ...chat, messages: chat.messages ? [...chat.messages, payload.message]
        : [payload.message]
    };

    state.list = state.list && state.list.map((chat) => {
      const isCurrent = chat.id === payload.groupId;

      if (isCurrent) {
        const numberOfUnreadMessages = payload.isOwn ? chat.numberOfUnreadMessages :
          (chat.numberOfUnreadMessages ? chat.numberOfUnreadMessages + 1 : 1);

        return {
          ...chat,
          lastMessage: payload.message,
          numberOfUnreadMessages
        };
      }

      return chat;
    });
  },

  [actions.setScroll.type]: (state, {payload}: PayloadAction<SetScrollPayload>) => {
    const chat = state.chats[payload.groupId] || {};

    state.chats[payload.groupId] = {
      ...chat, scroll: payload.scroll
    };
  },

  [actions.updateMessage.type]: (state, {payload}: PayloadAction<UpdateMessagePayload>) => {
    const chat = state.chats[payload.groupId] || {};

    state.chats[payload.groupId] = {
      ...chat, messages: chat.messages &&
        chat.messages.map((message) => message.id === payload.messageId ?
          ({...message, ...payload.partial}) : message)
    };

    state.list = state.list && state.list.map((chat) => {
      const isCurrent = chat.id === payload.groupId &&
        (chat.lastMessage && chat.lastMessage.id) === payload.messageId;

      if (isCurrent) return {
        ...chat,
        lastMessage: {
          ...chat.lastMessage!,
          ...payload.partial
        }
      };

      return chat;
    });
  },

  [actions.setNumberOfUnreadMessages.type]: (state, {payload}: PayloadAction<SetNumberOfUnreadMessagesPayload>) => {
    state.list = state.list && state.list
      .map((chat) => chat.id === payload.groupId ?
        ({...chat, numberOfUnreadMessages: payload.number}) : chat);
  }
});