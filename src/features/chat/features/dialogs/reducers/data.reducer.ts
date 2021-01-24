import {createReducer, PayloadAction, Reducer} from "@reduxjs/toolkit";
import {nanoid} from "nanoid";

import {CompanionOptions} from "@features/chat";
import {Message, DialogsListItem, User, ID} from "@api/common";
import * as actions from "../actions";

interface ExtendedDialogsListItem extends DialogsListItem {
  companion: User & CompanionOptions;
}

interface DialogChat {
  companion: User & CompanionOptions;
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

    [actions.fetchDialogs.fulfilled.type]: (state, {payload}: PayloadAction<{dialogs: (DialogsListItem & {companion: User & CompanionOptions})[]}>) => {
      state.list = payload.dialogs;
    },

    [actions.fetchCompanion.fulfilled.type]: ({dialogs, currentCompanionId}, {payload}: PayloadAction<{companion: User & CompanionOptions}>) => {
      const dialog = dialogs[currentCompanionId!] || emptyDialog;

      dialogs[currentCompanionId!] = {
        ...dialog, companion: dialog.companion ?
          {...dialog.companion, ...payload.companion} : payload.companion
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

    [actions.addMessage.type]: (state, {payload: {message, companionId, own}}: PayloadAction<{message: Message; companionId: ID; own: boolean}>) => {
      const dialog = state.dialogs[companionId] || emptyDialog;

      const companion = dialog.companion || message.sender;

      state.dialogs[companionId] = {
        ...dialog, companion,
        messages: dialog.messages ? [...dialog.messages, message] : [message]
      };

      if (state.list) {
        let idx = state.list.findIndex(({companion}) => companion.id === companionId);

        if (idx === -1) idx = state.list.length;

        const item = state.list[idx] || {};

        state.list[idx] = {
          ...item,
          unreadMessagesNumber: !own ? item.unreadMessagesNumber + 1 : item.unreadMessagesNumber,
          id: item.id || nanoid(),
          companion: item.companion || companion,
          lastMessage: message
        };
      }
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

    [actions.updateMessage.type]: ({dialogs}, {payload: {companionId, messageId, updatedMessage}}:
      PayloadAction<{companionId: ID; messageId: ID; updatedMessage: Message}>) => {

      const dialog = dialogs[companionId!] || emptyDialog;

      dialogs[companionId!] = {
        ...dialog,
        messages: dialog.messages &&
          dialog.messages.map((msg) => msg.id === messageId ? updatedMessage : msg)
      };
    },

    [actions.updateCompanion.type]: (state, {payload}: PayloadAction<{companion: Partial<User & CompanionOptions>; companionId: ID}>) => {
      const dialog = state.dialogs[payload.companionId] || emptyDialog;

      state.dialogs[payload.companionId] = {
        ...dialog, companion: {...dialog.companion, ...payload.companion}
      };

      state.list = state.list && state.list.map((item) =>
        item.companion.id === payload.companionId ?
          {...item, companion: {...item.companion, ...payload.companion}} : item);
    }
  }
);
