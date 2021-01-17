import {createReducer, PayloadAction, Reducer} from "@reduxjs/toolkit";
import {nanoid} from "nanoid";

import {ChatMemberStatus} from "@features/chat";
import {Message, DialogsListItem, User, ID} from "@api/common";
import * as actions from "../actions";

interface ExtendedDialogsListItem extends DialogsListItem {
  companion: User & {status: ChatMemberStatus};
}

interface DialogChat {
  companion: User & {status: ChatMemberStatus};
  messages: Message[] | null;
  areAllMessagesFetched?: boolean;
}

interface InitialState {
  list: ExtendedDialogsListItem[] | null;
  currentCompanionId: ID | null;
  dialogs: {
    [key: string]: DialogChat;
  };
}

const emptyDialog = {
  areAllMessagesFetched: false,
  companion: null,
  messages: null
};

export const dataReducer: Reducer<InitialState> = createReducer<InitialState>(
  {
    list: null,
    currentCompanionId: null,
    dialogs: {}
  },
  {
    [actions.setCurrentCompanionId.type]: (state, {payload}: PayloadAction<{id: ID}>) => {
      state.currentCompanionId = payload.id;
    },

    [actions.fetchDialogs.fulfilled.type]: (state, {payload}: PayloadAction<{dialogs: DialogsListItem[]}>) => {
      state.list = payload.dialogs.map((dialog) => ({...dialog, companion: {...dialog.companion, status: null}}));
    },

    [actions.fetchCompanion.fulfilled.type]: ({dialogs, currentCompanionId}, {payload}: PayloadAction<{user: User}>) => {
      const dialog = dialogs[currentCompanionId!] || emptyDialog;

      dialogs[currentCompanionId!] = {
        ...dialog, companion: {...payload.user, status: null}
      };
    },

    [actions.fetchMessages.fulfilled.type]: ({dialogs, currentCompanionId}, {payload}: PayloadAction<{messages: Message[]}>) => {
      const dialog = dialogs[currentCompanionId!] || emptyDialog;

      dialogs[currentCompanionId!] = {
        ...dialog,
        messages: dialog.messages ? [...payload.messages, ...dialog.messages] : payload.messages,
        areAllMessagesFetched: payload.messages.length === 0
      };
    },

    [actions.addMessage.type]: (state, {payload: {message}}: PayloadAction<{message: Message}>) => {
      const dialog = state.dialogs[state.currentCompanionId!] || emptyDialog;

      state.dialogs[state.currentCompanionId!] = {
        ...dialog,
        messages: dialog.messages ? [...dialog.messages, message] : [message]
      };

      if (state.list) {
        let idx = state.list.findIndex(({companion}) => companion.id === state.currentCompanionId);

        if (idx === -1) idx = state.list.length;

        const item = state.list[idx] || {};

        state.list[idx] = {
          ...item,
          id: item.id || nanoid(),
          companion: item.companion || dialog.companion,
          lastMessage: message
        };
      }
    },

    [actions.addCompanionMessage.type]: (
      state, {payload: {message}}: PayloadAction<{message: Message}>
    ) => {
      const dialog = state.dialogs[message.sender.id] || emptyDialog;

      state.dialogs[message.sender.id] = {
        ...dialog,
        companion: {...message.sender, status: null},
        messages: dialog.messages && [...dialog.messages, message]
      };

      if (state.list) {
        let idx = state.list.findIndex(({companion}) => companion.id === message.sender.id);

        if (idx === -1) idx = state.list.length;

        const item = state.list[idx] || {};

        state.list[idx] = {
          ...item,
          id: item.id || nanoid(),
          companion: item.companion || message.sender,
          unreadMessagesNumber: item.unreadMessagesNumber ? item.unreadMessagesNumber + 1 : 1,
          lastMessage: message
        };
      }
    },

    [actions.setCompanionStatus.type]: (state, {payload: {companionId, status}}:
      PayloadAction<{companionId: ID, status: ChatMemberStatus}>) => {
      const dialog = state.dialogs[companionId] || emptyDialog;

      state.dialogs[companionId] = {...dialog, companion: {...dialog.companion, status}};

      state.list = state.list && state.list.map((item) => item.companion.id === companionId ? {...item, status} : item);
    },

    [actions.updateMessage.type]: ({dialogs}, {payload: {companionId, messageId, updatedMessage}}:
      PayloadAction<{companionId: ID; messageId: ID; updatedMessage: Message}>) => {

      const dialog = dialogs[companionId!] || emptyDialog;

      dialogs[companionId!] = {
        ...dialog,
        messages: dialog.messages &&
          dialog.messages.map((msg) => msg.id === messageId ? updatedMessage : msg)
      };
    },

    [actions.setMessagesRead.type]: (
      state, {payload: {messagesIds, companionId}}: PayloadAction<{messagesIds: ID[]; companionId: ID}>
    ) => {
      const dialog = state.dialogs[companionId] || emptyDialog;

      const messages = dialog.messages && dialog.messages
        .map((msg) => messagesIds.includes(msg.id) ? {...msg, read: true} : msg);

      state.dialogs[companionId] = {...dialog, messages};

      state.list = state.list && state.list.map((item) =>
          (item.companion.id === companionId) && (messagesIds.includes(item.lastMessage.id)) ? {
              ...item, unreadMessagesNumber: 0,
              lastMessage: {...item.lastMessage, read: true}
            } : {
              ...item,
              unreadMessagesNumber: messages ?
                messages.filter(({read}) => !read).length
                : item.unreadMessagesNumber
            }
        );
    },

    [actions.setCompanionOnlineStatus.type]: (state, {payload}: PayloadAction<{online: boolean; companionId: ID}>) => {
      const dialog = state.dialogs[payload.companionId] || emptyDialog;

      const companion = dialog.companion && {...dialog.companion, online: payload.online};

      state.dialogs[payload.companionId] = {...dialog, companion};

      state.list = state.list && state.list.map((item) =>
        item.companion.id === payload.companionId ?
          {...item, companion: {...item.companion, online: payload.online}} : item);
    }
  }
);
