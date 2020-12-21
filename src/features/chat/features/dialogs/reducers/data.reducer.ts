import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import {Dialog, Message, GetMessagesData} from "@api/dialog.api";
import * as actions from "../actions";
interface InitialState {
  dialogs: {
    [key: number]: Dialog;
  };
  currentCompanionId: number | null;
}

export const dataReducer = createReducer<InitialState>(
  {
    dialogs: {},
    currentCompanionId: null
  },
  {
    [actions.fetchDialogs.fulfilled.type]: (state, {payload}: PayloadAction<{dialogs: Dialog[]}>) => {
        payload.dialogs.forEach(({id, companion, latestMessage}) => {
            state.dialogs[companion.id] = {
                id, companion, messages: [latestMessage!]
            };
        })
    },

    [actions.fetchMessages.fulfilled.type]: (state, {payload}: PayloadAction<{messages: Message[]}>) => {
      const dialog = state.dialogs[state.currentCompanionId!] || {messages: []};

      state.dialogs[state.currentCompanionId!] = {
        ...dialog,
        messages: [...dialog.messages!, ...payload.messages]
      };
    },

    [actions.fetchCreateMessage.fulfilled.type]: (state, {payload}: PayloadAction<{message: Message}>) => {
        
    },

    [actions.fetchDialog.fulfilled.type]: (state, {payload}: PayloadAction<{dialog: Dialog}>) => {
      const dialog = state.dialogs[state.currentCompanionId!] || {messages: []};

      state.dialogs[state.currentCompanionId!] = {
        messages: dialog.messages,
        ...payload.dialog
      };
    },

    [actions.setCurrentCompanionId.type]: (state, {payload}: PayloadAction<number>) => {
      state.currentCompanionId = payload;
    }
  }
);
