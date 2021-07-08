import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {AttachedAudio, AttachedImage, AttachedFile} from "@features/chats";
import {DirectChatMessage, DirectChat, DirectChatsListItem} from "./lib/typings";
import {
  AddChatPayload,
  AddMessagePayload,
  FetchAudiosData,
  FetchAudiosPayload,
  FetchChatData,
  FetchChatPayload,
  FetchChatsPayload, FetchFilesData, FetchFilesPayload, FetchImagesData,
  FetchImagesPayload,
  FetchMessagesData,
  FetchMessagesPayload,
  ReadMessagePayload,
  SetNumberOfUnreadMessagesPayload,
  SetScrollPayload,
  UpdateMessagePayload
} from "./actions";
import * as actions from "./actions";

interface DirectsState {
  list: DirectChatsListItem[] | null;
  areChatsFetching: boolean;
  chats: {
    [key: string]: {
      chat: DirectChat | null;
      messages: DirectChatMessage[];
      isFetching: boolean;
      areMessagesFetching: boolean;
      areMessagesFetched: boolean;
      areMessagesLeftToFetch: boolean;
      images: AttachedImage[];
      areImagesFetching: boolean;
      files: AttachedFile[];
      areFilesFetching: boolean;
      audios: AttachedAudio[];
      areAudiosFetching: boolean;
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

  [actions.fetchChats.fulfilled.type]: (state, {payload}: PayloadAction<FetchChatsPayload>) => {
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
      chat: payload.chat,
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

  [actions.fetchAudios.pending.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchAudiosData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat, areAudiosFetching: true
    };
  },

  [actions.fetchAudios.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchAudiosPayload, string, {arg: FetchAudiosData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat,
      audios: payload.audios,
      areAudiosFetching: false
    };
  },

  [actions.fetchAudios.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchAudiosData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat, areAudiosFetching: false
    };
  },

  [actions.fetchImages.pending.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchImagesData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat, areImagesFetching: true
    };
  },

  [actions.fetchImages.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchImagesPayload, string, {arg: FetchImagesData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat,
      images: payload.images,
      areImagesFetching: false
    };
  },

  [actions.fetchImages.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchImagesData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat, areImagesFetching: false
    };
  },

  [actions.fetchFiles.pending.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchFilesData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat, areFilesFetching: true
    };
  },

  [actions.fetchFiles.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchFilesPayload, string, {arg: FetchFilesData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat,
      files: payload.files,
      areFilesFetching: false
    };
  },

  [actions.fetchFiles.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchFilesData}>) => {
    const chat = state.chats[arg.partnerId] || {};

    state.chats[arg.partnerId] = {
      ...chat, areFilesFetching: false
    };
  },

  [actions.addMessage.type]: (state, {payload}: PayloadAction<AddMessagePayload>) => {
    const chat = state.chats[payload.partnerId] || {};

    state.chats[payload.partnerId] = {
      ...chat,
      messages: chat.messages ? [...chat.messages, payload.message] : [payload.message]
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
  },

  [actions.addChat.type]: (state, {payload}: PayloadAction<AddChatPayload>) => {
    const chat = state.chats[payload.partnerId] || {};

    state.chats[payload.partnerId] = {
      ...chat, ...payload.chat
    };
  }
});