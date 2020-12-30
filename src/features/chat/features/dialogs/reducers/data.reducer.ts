import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {IDialog, IMessage, IDialogsListItem} from "@api/dialog.api";
import {IUser} from "@api/auth.api";
import * as actions from "../actions";

interface InitialState {
  list: IDialogsListItem[];
  currentCompanionId: string | null;
  dialogs: {
    [key: string]: {
      companion?: IUser;
      messages?: IMessage[];
    };
  };
}

export const dataReducer = createReducer<InitialState>(
  {
    list: [],
    currentCompanionId: null,
    dialogs: {}
  },
  {
    [actions.fetchDialogs.fulfilled.type]: (
      state,
      {payload}: PayloadAction<{dialogs: IDialogsListItem[]}>
    ) => {
      state.list = payload.dialogs;
    },

    [actions.fetchMessages.fulfilled.type]: (
      {dialogs, currentCompanionId},
      {payload}: PayloadAction<{messages: IMessage[]}>
    ) => {
      const dialog = dialogs[currentCompanionId!] || {};

      dialog.messages = payload.messages;

      dialogs[currentCompanionId!] = dialog;
    },

    [actions.fetchCreateMessage.fulfilled.type]: (
      state,
      {payload}: PayloadAction<{message: IMessage}>
    ) => {},

    [actions.fetchCompanion.fulfilled.type]: (
      {dialogs, currentCompanionId},
      {payload}: PayloadAction<{user: IUser}>
    ) => {
      const dialog = dialogs[currentCompanionId!] || {};

      dialogs[currentCompanionId!] = {
        companion: payload.user,
        messages: dialog.messages
      };
    },

    [actions.setCurrentCompanionId.type]: (
      state,
      {payload}: PayloadAction<string>
    ) => {
      state.currentCompanionId = payload;
    },

    [actions.addCompanionMessage.type]: (
      state,
      {payload}: PayloadAction<IMessage>
    ) => {
      let idx = state.list.findIndex(
        (item) => item.companion.id === payload.sender.id
      );

      if (idx === -1) idx = state.list.length;

      state.list[idx] = {
        id: state.list[idx]?.id,
        companion: payload.sender,
        lastMessage: payload
      };

      const dialog = state.dialogs[payload.sender.id] || {};

      dialog.companion = payload.sender;
      dialog.messages = dialog.messages
        ? [...dialog.messages, payload]
        : [payload];

      state.dialogs[payload.sender.id] = dialog;
    },

    [actions.addMessage.type]: (
      state,
      {
        payload: {companion, message}
      }: PayloadAction<{companion: IUser; message: IMessage & {id?: number}}>
    ) => {
      let idx = state.list.findIndex(
        (item) => item.companion.id === companion.id
      );

      if (idx === -1) idx = state.list.length;

      state.list[idx] = {
        id: state.list[idx]?.id,
        companion: companion,
        lastMessage: message
      };

      const dialog = state.dialogs[companion.id] || {};

      dialog.messages = dialog.messages
        ? [...dialog.messages, message]
        : [message];

      state.dialogs[companion.id] = dialog;
    },

    [actions.setMessagesRead.type]: (
      {dialogs, currentCompanionId},
      {payload}: PayloadAction<string[]>
    ) => {
      const dialog = dialogs[currentCompanionId!] || {};

      dialog.messages = dialog.messages
        ? dialog.messages.map((msg) =>
            payload.includes(msg.id) ? {...msg, isRead: true} : msg
          )
        : [];

      dialogs[currentCompanionId!] = dialog;
    }
  }
);
