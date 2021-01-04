import {createReducer, PayloadAction} from "@reduxjs/toolkit";
import {nanoid} from "nanoid";

import {IMessage, IDialogsListItem, IUser} from "@api/common";
import * as actions from "../actions";

interface InitialState {
  list: (IDialogsListItem & {status: string | null})[] | null;
  currentCompanionId: string | null;
  dialogs: {
    [key: string]: {
      companion: IUser;
      messages: IMessage[];
      status: string | null;
      areAllMessagesFetched?: boolean;
    };
  };
}

export const dataReducer = createReducer<InitialState>(
  {
    list: null,
    currentCompanionId: null,
    dialogs: {}
  },
  {
    [actions.setCurrentCompanionId.type]: (state, {payload}: PayloadAction<string>) => {
      state.currentCompanionId = payload;
    },

    [actions.fetchDialogs.fulfilled.type]: (state, {payload}: PayloadAction<{dialogs: IDialogsListItem[]}>) => {
      state.list = payload.dialogs.map((dialog) => ({...dialog, status: null}));
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

    [actions.addMessage.type]: (state, {payload}: PayloadAction<IMessage>) => {
      const dialog = state.dialogs[state.currentCompanionId!] || {};

      state.dialogs[state.currentCompanionId!] = {
        ...dialog,
        messages: dialog.messages ? [...dialog.messages, payload] : [payload]
      };

      if (state.list) {
        let idx = state.list.findIndex(({companion}) => companion.id === state.currentCompanionId);

        if (idx === -1) idx = state.list.length;

        const item = state.list[idx] || {};

        state.list[idx] = {
          ...item,
          id: item.id || nanoid(),
          companion: item.companion || dialog.companion,
          lastMessage: payload
        };
      }
    },

    [actions.addCompanionMessage.type]: (
      state, {payload}: PayloadAction<IMessage>
    ) => {
      const dialog = state.dialogs[payload.sender.id] || {};

      state.dialogs[payload.sender.id] = {
        ...dialog,
        companion: payload.sender,
        messages: dialog.messages && [...dialog.messages, payload],
      };

      if (state.list) {
        let idx = state.list.findIndex(({companion}) => companion.id === payload.sender.id);

        if (idx === -1) idx = state.list.length;

        const item = state.list[idx] || {};

        state.list[idx] = {
          ...item,
          id: item.id || nanoid(),
          companion: item.companion || payload.sender,
          unreadMessagesNumber: item.unreadMessagesNumber ? item.unreadMessagesNumber + 1 : 1,
          lastMessage: payload
        };
      }
    },

    [actions.setCompanionStatus.type]: (state, {payload: {companionId, status}}:
      PayloadAction<{companionId: string, status: string | null}>) => {
      const dialog = state.dialogs[companionId] || {};

      state.dialogs[companionId] = {...dialog, status};

      state.list = state.list && state.list.map((item) => item.companion.id === companionId ? {...item, status} : item);
    },

    [actions.updateMessage.type]: ({dialogs}, {payload: {companionId, messageId, updatedMessage}}:
      PayloadAction<{companionId: string; messageId: string; updatedMessage: IMessage}>) => {
      const dialog = dialogs[companionId!] || {};

      dialogs[companionId!] = {
        ...dialog,
        messages: dialog.messages &&
          dialog.messages.map((msg) => msg.id === messageId ? updatedMessage : msg),
      };
    },

    [actions.setMessagesRead.type]: (
      state, {payload: {ids, companionId}}: PayloadAction<{ids: string[]; companionId: string}>
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
    }
  }
);
