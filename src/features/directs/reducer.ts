import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {GetDirectChatsResponse} from "@api/direct-chats.api";
import {DirectChatMessage, DirectChat, DirectChatsListItem} from "./lib/typings";
import {
  AddMessagePayload, FetchChatData, FetchChatPayload,
  FetchMessagesData, FetchMessagesPayload, ReadMessagePayload, SetNumberOfUnreadMessagesPayload,
  SetScrollPayload, UpdateMessagePayload
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
      areMessagesFetched: boolean;
      areMessagesLeftToFetch: boolean;
      scroll: number;
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
      areMessagesFetched: true,
      areMessagesLeftToFetch: !!payload.messages.length,
      messages: chat.messages ? [...payload.messages, ...chat.messages]
        : payload.messages
    };
  },

  [actions.fetchMessages.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchMessagesData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat, areMessagesFetching: false
    };
  },

  [actions.addMessage.type]: (state, {payload}: PayloadAction<AddMessagePayload>) => {
    const chat = state.chats[payload.partnerId] || {};

    state.chats[payload.partnerId] = {
      ...chat, messages: chat.messages ? [...chat.messages, payload.message]
        : [payload.message]
    };

    state.list = state.list && state.list.map((chat) => {
      const isCurrent = chat.partner.id === payload.partnerId;

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
    const chat = state.chats[payload.partnerId] || {};

    state.chats[payload.partnerId] = {
      ...chat, scroll: payload.scroll
    };
  },

  [actions.updateMessage.type]: (state, {payload}: PayloadAction<UpdateMessagePayload>) => {
    const chat = state.chats[payload.partnerId] || {};

    state.chats[payload.partnerId] = {
      ...chat, messages: chat.messages &&
        chat.messages.map((message) => message.id === payload.messageId ?
          ({...message, ...payload.partial}) : message)
    };

    state.list = state.list && state.list.map((chat) => {
      const isCurrent = chat.partner.id === payload.partnerId &&
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

  [actions.readMessage.type]: (state, {payload}: PayloadAction<ReadMessagePayload>) => {
    const chat = state.chats[payload.partnerId] || {};

    const idx = chat.messages && chat.messages
      .findIndex((message) => message.id === payload.messageId);

    state.chats[payload.partnerId] = {
      ...chat,
      messages: chat.messages && chat.messages
        .map((message, index) => idx >= index ? ({...message, isRead: true}) : message)
    };

    state.list = state.list && state.list.map((chat) => {
      const isCurrent = chat.partner.id === payload.partnerId &&
        (chat.lastMessage && chat.lastMessage.id) === payload.messageId;

      if (isCurrent) return ({
        ...chat, lastMessage: {
          ...chat.lastMessage!, isRead: true
        }
      });

      return chat;
    });
  },

  [actions.setNumberOfUnreadMessages.type]: (state, {payload}: PayloadAction<SetNumberOfUnreadMessagesPayload>) => {
    state.list = state.list && state.list
      .map((chat) => chat.partner.id === payload.partnerId ?
        ({...chat, numberOfUnreadMessages: payload.number}) : chat);
  }
});