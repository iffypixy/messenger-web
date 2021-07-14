import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {GroupMessage, Group, GroupsListItem} from "./lib/typings";
import {
  AddMessagePayload,
  FetchChatData,
  FetchChatPayload,
  FetchMessagesData,
  FetchMessagesPayload,
  ReadMessagePayload,
  SetUnreadPayload,
  UpdateMessagePayload,
  FetchChatsPayload,
  AddChatPayload,
  IncreaseParticipantsPayload,
  DecreaseParticipantsPayload,
  RemoveChatPayload, ChangeMemberPayload
} from "./actions";
import * as actions from "./actions";
import {AttachedAudio, AttachedFile, AttachedImage} from "@features/chats";

export interface Chat {
  group: Group | null;
  messages: GroupMessage[];
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

interface GroupsState {
  list: GroupsListItem[] | null;
  areChatsFetching: boolean;
  chats: {
    [key: string]: Chat | null;
  };
}

const fallback: Chat = {
  group: null,
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

export const reducer = createReducer<GroupsState>({
  chats: {},
  areChatsFetching: false,
  list: null
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
    const chat = state.chats[arg.groupId] || fallback;

    state.chats[arg.groupId] = {
      ...chat, isFetching: true
    };
  },

  [actions.fetchChat.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchChatPayload, string, {arg: FetchChatData}>) => {
    const chat = state.chats[arg.groupId] || fallback;

    state.chats[arg.groupId] = {
      ...chat,
      group: payload.chat,
      isFetching: false
    };
  },

  [actions.fetchChat.rejected.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchChatData}>) => {
    const chat = state.chats[arg.groupId] || fallback;

    state.chats[arg.groupId] = {
      ...chat, isFetching: false
    };
  },

  [actions.fetchMessages.pending.type]: (state, {meta: {arg}}: PayloadAction<void, string, {arg: FetchMessagesData}>) => {
    const chat = state.chats[arg.groupId] || fallback;

    state.chats[arg.groupId] = {
      ...chat, areMessagesFetching: true
    };
  },

  [actions.fetchMessages.fulfilled.type]: (state, {payload, meta: {arg}}: PayloadAction<FetchMessagesPayload, string, {arg: FetchMessagesData}>) => {
    const chat = state.chats[arg.groupId] || fallback;

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
    const chat = state.chats[arg.groupId] || fallback;

    state.chats[arg.groupId] = {
      ...chat, areMessagesFetching: false
    };
  },

  [actions.readMessage.type]: (state, {payload}: PayloadAction<ReadMessagePayload>) => {
    const chat = state.chats[payload.groupId] || fallback;

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
    const chat = state.chats[payload.groupId] || fallback;

    state.chats[payload.groupId] = {
      ...chat,
      messages: chat.messages ? [...chat.messages, payload.message] : [payload.message]
    };

    state.list = state.list && state.list.map((chat) => {
      const isCurrent = chat.id === payload.groupId;

      if (isCurrent) {
        const unread = payload.isOwn ? chat.unread : (chat.unread ? chat.unread + 1 : 1);

        return {
          ...chat, unread,
          lastMessage: payload.message
        };
      }

      return chat;
    });
  },

  [actions.updateMessage.type]: (state, {payload}: PayloadAction<UpdateMessagePayload>) => {
    const chat = state.chats[payload.groupId] || fallback;

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

  [actions.setUnread.type]: (state, {payload}: PayloadAction<SetUnreadPayload>) => {
    state.list = state.list && state.list.map((chat) =>
      chat.id === payload.groupId ? ({...chat, unread: payload.unread}) : chat);
  },

  [actions.addChat.type]: (state, {payload}: PayloadAction<AddChatPayload>) => {
    state.chats[payload.group.id] = {
      ...fallback,
      group: payload.group
    };
  },

  [actions.removeChat.type]: (state, {payload}: PayloadAction<RemoveChatPayload>) => {
    state.chats[payload.groupId] = null;
  },

  [actions.increaseParticipants.type]: (state, {payload}: PayloadAction<IncreaseParticipantsPayload>) => {
    const chat = state.chats[payload.groupId]!;

    state.chats[payload.groupId] = {
      ...chat, group: {
        ...chat.group!,
        participants: chat.group!.participants + 1
      }
    };
  },

  [actions.decreaseParticipants.type]: (state, {payload}: PayloadAction<DecreaseParticipantsPayload>) => {
    const chat = state.chats[payload.groupId]!;

    state.chats[payload.groupId] = {
      ...chat, group: {
        ...chat.group!,
        participants: chat.group!.participants - 1
      }
    };
  },

  [actions.changeMember.type]: (state, {payload}: PayloadAction<ChangeMemberPayload>) => {
    const chat = state.chats[payload.groupId]!;

    state.chats[payload.groupId] = {
      ...chat, group: {
        ...chat.group!,
        member: payload.member
      }
    };
  }
});