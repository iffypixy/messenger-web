import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {AttachedAudio, AttachedImage, AttachedFile} from "@features/chats";
import {DirectMessage, Direct, DirectsListItem} from "./lib/typings";
import {
  AddMessagePayload,
  FetchAttachedAudiosData,
  FetchAttachedAudiosPayload,
  FetchChatData,
  FetchChatPayload,
  FetchChatsPayload,
  FetchAttachedFilesData,
  FetchAttachedFilesPayload,
  FetchAttachedImagesData,
  FetchAttachedImagesPayload,
  FetchMessagesData,
  FetchMessagesPayload,
  ReadMessagePayload,
  SetUnreadPayload,
  UpdateMessagePayload, SetDirectPayload
} from "./actions";
import * as actions from "./actions";

interface Chat {
  direct: Direct | null;
  messages: DirectMessage[];
  images: AttachedImage[];
  files: AttachedFile[];
  audios: AttachedAudio[];
  isFetching: boolean;
  areMessagesFetching: boolean;
  areMessagesFetched: boolean;
  areMessagesLeftToFetch: boolean;
  areImagesFetching: boolean;
  areFilesFetching: boolean;
  areAudiosFetching: boolean;
}

interface DirectsState {
  list: DirectsListItem[] | null;
  areChatsFetching: boolean;
  chats: {
    [key: string]: Chat;
  };
}

const fallback: Chat = {
  direct: null,
  messages: [],
  images: [],
  files: [],
  audios: [],
  isFetching: false,
  areMessagesFetching: false,
  areMessagesFetched: false,
  areMessagesLeftToFetch: true,
  areImagesFetching: false,
  areFilesFetching: false,
  areAudiosFetching: false
};

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
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat, isFetching: true
    };
  },

  [actions.fetchChat.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchChatPayload, string, {arg: FetchChatData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat,
      direct: payload.chat,
      isFetching: false
    };
  },

  [actions.fetchChat.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchChatData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat, isFetching: false
    };
  },

  [actions.fetchMessages.pending.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchMessagesData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat, areMessagesFetching: true
    };
  },

  [actions.fetchMessages.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchMessagesPayload, string, {arg: FetchMessagesData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat,
      areMessagesFetching: false,
      areMessagesFetched: true,
      areMessagesLeftToFetch: !!payload.messages.length,
      messages: chat.messages ? [...payload.messages, ...chat.messages] : payload.messages
    };
  },

  [actions.fetchMessages.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchMessagesData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat, areMessagesFetching: false
    };
  },

  [actions.fetchAttachedAudios.pending.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchAttachedAudiosData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat, areAudiosFetching: true
    };
  },

  [actions.fetchAttachedAudios.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchAttachedAudiosPayload, string, {arg: FetchAttachedAudiosData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat,
      audios: payload.audios,
      areAudiosFetching: false
    };
  },

  [actions.fetchAttachedAudios.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchAttachedAudiosData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat, areAudiosFetching: false
    };
  },

  [actions.fetchAttachedImages.pending.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchAttachedImagesData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat, areImagesFetching: true
    };
  },

  [actions.fetchAttachedImages.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchAttachedImagesPayload, string, {arg: FetchAttachedImagesData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat,
      images: payload.images,
      areImagesFetching: false
    };
  },

  [actions.fetchAttachedImages.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchAttachedImagesData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat, areImagesFetching: false
    };
  },

  [actions.fetchAttachedFiles.pending.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchAttachedFilesData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat, areFilesFetching: true
    };
  },

  [actions.fetchAttachedFiles.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchAttachedFilesPayload, string, {arg: FetchAttachedFilesData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat,
      files: payload.files,
      areFilesFetching: false
    };
  },

  [actions.fetchAttachedFiles.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchAttachedFilesData}>) => {
    const chat = state.chats[arg.partnerId] || fallback;

    state.chats[arg.partnerId] = {
      ...chat,
      areFilesFetching: false
    };
  },

  [actions.addMessage.type]: (state, {payload}: PayloadAction<AddMessagePayload>) => {
    const chat = state.chats[payload.partnerId] || fallback;

    state.chats[payload.partnerId] = {
      ...chat,
      messages: chat.messages ? [...chat.messages, payload.message] : [payload.message],
      direct: chat.direct || payload.chat
    };

    state.list = state.list && state.list.map((chat, idx, {length}) => {
      const isCurrent = chat.partner.id === payload.partnerId;
      const isLast = idx === length - 1;

      if (isLast && !isCurrent) {
        state.list!.push({
          details: payload.chat.details,
          partner: payload.chat.partner,
          lastMessage: payload.message,
          isBanned: payload.chat.isBanned,
          unread: 1
        });
      }

      if (isCurrent) {
        const unread = payload.isOwn ? chat.unread : (chat.unread ? chat.unread + 1 : 1);

        return {
          ...chat,
          unread,
          lastMessage: payload.message
        };
      }

      return chat;
    });
  },

  [actions.updateMessage.type]: (state, {payload}: PayloadAction<UpdateMessagePayload>) => {
    const chat = state.chats[payload.partnerId] || fallback;

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
    const chat = state.chats[payload.partnerId] || fallback;

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

  [actions.setUnread.type]: (state, {payload}: PayloadAction<SetUnreadPayload>) => {
    state.list = state.list && state.list
      .map((chat) => chat.partner.id === payload.partnerId ?
        ({...chat, unread: payload.unread}) : chat);
  },

  [actions.setDirect.type]: (state, {payload}: PayloadAction<SetDirectPayload>) => {
    const chat = state.chats[payload.partnerId] || fallback;

    state.chats[payload.partnerId] = {
      ...chat, direct: payload.direct
    };
  }
});