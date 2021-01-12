import {createReducer, PayloadAction, Reducer} from "@reduxjs/toolkit";
import {nanoid} from "nanoid";

import {IMessage, IDialogsListItem, IUser, ID} from "@api/common";
import * as actions from "../actions";

interface IListItem extends IDialogsListItem {
  status?: string | null;
}

interface IDialog {
  companion: IUser;
  messages: IMessage[];
  status?: string | null;
  areAllMessagesFetched?: boolean;
}

interface InitialState {
  list: IListItem[] | null;
  currentCompanionId: ID | null;
  dialogs: {
    [key: string]: IDialog;
  };
}

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

    [actions.fetchDialogs.fulfilled.type]: (state, {payload}: PayloadAction<{dialogs: IDialogsListItem[]}>) => {
      state.list = payload.dialogs;
    },

    [actions.fetchCompanion.fulfilled.type]: ({dialogs, currentCompanionId}, {payload}: PayloadAction<{user: IUser}>) => {
      const dialog = dialogs[currentCompanionId!] || {};

      dialogs[currentCompanionId!] = {
        ...dialog, companion: payload.user
      };
    },

    [actions.fetchMessages.fulfilled.type]: ({dialogs, currentCompanionId}, {payload}: PayloadAction<{messages: IMessage[]}>) => {
      const dialog = dialogs[currentCompanionId!] || {};

      dialogs[currentCompanionId!] = {
        ...dialog,
        messages: dialog.messages ?
          [...payload.messages, ...dialog.messages] : payload.messages,
        areAllMessagesFetched: payload.messages.length === 0
      };
    },

    [actions.addMessage.type]: (state, {payload: {message}}: PayloadAction<{message: IMessage}>) => {
      const dialog = state.dialogs[state.currentCompanionId!] || {};

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
      state, {payload: {message}}: PayloadAction<{message: IMessage}>
    ) => {
      const dialog = state.dialogs[message.sender.id] || {};

      state.dialogs[message.sender.id] = {
        ...dialog,
        companion: message.sender,
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
      PayloadAction<{companionId: ID, status: string | null}>) => {
      const dialog = state.dialogs[companionId] || {};

      state.dialogs[companionId] = {...dialog, status};

      state.list = state.list && state.list.map((item) => item.companion.id === companionId ? {...item, status} : item);
    },

    [actions.updateMessage.type]: ({dialogs}, {payload: {companionId, messageId, updatedMessage}}:
      PayloadAction<{companionId: ID; messageId: ID; updatedMessage: IMessage}>) => {
      const dialog = dialogs[companionId!] || {};

      dialogs[companionId!] = {
        ...dialog,
        messages: dialog.messages &&
          dialog.messages.map((msg) => msg.id === messageId ? updatedMessage : msg)
      };
    },

    [actions.setMessagesRead.type]: (
      state, {payload: {ids, companionId}}: PayloadAction<{ids: ID[]; companionId: ID}>
    ) => {
      const dialog = state.dialogs[companionId] || {};

      const messages = dialog.messages && dialog.messages
        .map((msg) => ids.includes(msg.id) ? {...msg, isRead: true} : msg);

      state.dialogs[companionId] = {...dialog, messages};

      state.list = state.list && state.list
        .map((item) =>
          (item.companion.id === companionId) &&
          (ids.includes(item.lastMessage.id)) ?
            {
              ...item, unreadMessagesNumber: 0,
              lastMessage: {...item.lastMessage, isRead: true}
            } : {
              ...item,
              unreadMessagesNumber: messages ?
                messages.filter(({isRead}) => !isRead).length
                : item.unreadMessagesNumber
            }
        );
    },

    [actions.setCompanionOnlineStatus.type]: (state, {payload}: PayloadAction<{online: boolean; companionId: ID}>) => {
      const dialog = state.dialogs[payload.companionId] || {};

      const companion = dialog.companion && {...dialog.companion, online: payload.online};

      state.dialogs[payload.companionId] = {...dialog, companion};

      state.list = state.list && state.list.map((item) =>
        item.companion.id === payload.companionId ?
          {...item, companion: {...item.companion, online: payload.online}} : item);
    }
  }
);
