import {createReducer, PayloadAction} from "@reduxjs/toolkit";
import {nanoid} from "nanoid";

import {IMessage, IDialogsListItem, IUser} from "@api/common";
import * as actions from "../actions";

interface InitialState {
  list: IDialogsListItem[] | null;
  currentCompanionId: string | null;
  dialogs: {
    [key: string]: {
      companion: IUser;
      messages: IMessage[];
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
      state.list = payload.dialogs;
    },

    [actions.fetchCompanion.fulfilled.type]: ({dialogs, currentCompanionId}, {payload}: PayloadAction<{user: IUser}>) => {
      const dialog = dialogs[currentCompanionId!] || {};

      dialogs[currentCompanionId!] = {
        companion: payload.user,
        messages: dialog.messages
      };
    },

    [actions.fetchMessages.fulfilled.type]: ({dialogs, currentCompanionId}, {payload}: PayloadAction<{messages: IMessage[]}>) => {
      const dialog = dialogs[currentCompanionId!] || {};

      dialogs[currentCompanionId!] = {
        companion: dialog.companion,
        messages: dialog.messages ? [...payload.messages, ...dialog.messages]
          : payload.messages
      };
    },

    [actions.addMessage.type]: (state, {payload}: PayloadAction<IMessage>) => {
      const dialog = state.dialogs[state.currentCompanionId!] || {};

      state.dialogs[state.currentCompanionId!] = {
        companion: dialog.companion,
        messages: dialog.messages ? [...dialog.messages, payload] : [payload]
      };

      if (state.list) {
        let idx = state.list.findIndex(({companion}) => companion.id === state.currentCompanionId);

        if (idx === -1) idx = state.list.length;

        state.list[idx] = {
          id: state.list[idx]?.id || nanoid(),
          companion: state.list[idx]?.companion || dialog.companion,
          unreadMessagesNumber: state.list[idx]?.unreadMessagesNumber,
          lastMessage: payload
        };
      }
    },

    [actions.addCompanionMessage.type]: (
      state, {payload}: PayloadAction<IMessage>
    ) => {
      const dialog = state.dialogs[payload.sender.id] || {};

      state.dialogs[payload.sender.id] = {
        companion: payload.sender,
        messages: dialog.messages && [...dialog.messages, payload]
      };

      if (state.list) {
        let idx = state.list.findIndex(({companion}) => companion.id === payload.sender.id);

        if (idx === -1) idx = state.list.length;

        state.list[idx] = {
          id: state.list[idx]?.id || nanoid(),
          companion: state.list[idx]?.companion || payload.sender,
          unreadMessagesNumber: state.list[idx]?.unreadMessagesNumber ? state.list[idx]?.unreadMessagesNumber + 1 : 1,
          lastMessage: payload
        };
      }
    },

    [actions.updateMessage.type]: ({dialogs}, {payload: {companionId, messageId, updatedMessage}}:
      PayloadAction<{companionId: string; messageId: string; updatedMessage: IMessage}>) => {
      const dialog = dialogs[companionId!] || {};

      dialogs[companionId!] = {
        companion: dialog.companion,
        messages: dialog.messages && dialog.messages.map((msg) => msg.id === messageId ? updatedMessage : msg)
      };
    },

    [actions.setMessagesRead.type]: (
      state, {payload: {ids, companionId}}: PayloadAction<{ids: string[]; companionId: string}>
    ) => {
      const dialog = state.dialogs[companionId] || {};

      const messages = dialog.messages && dialog.messages
        .map((msg) => ids.includes(msg.id) ? {...msg, isRead: true} : msg);

      state.dialogs[companionId] = {companion: dialog.companion, messages};

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
