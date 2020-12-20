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
        payload.dialogs.forEach((dialog) => {
            state.dialogs[dialog.companion.id] = {
                id: dialog.id,
                companion: dialog.companion, 
                messages: [dialog.latestMessage!],
                latestMessage: dialog.latestMessage
            };
        })
    },

    [actions.fetchMessages.fulfilled.type]: (state, {payload}: PayloadAction<{messages: Message[]}>) => {
        const dialog = state.dialogs[state.currentCompanionId!] || {};

        dialog.messages = dialog.messages ? [...dialog.messages, ...payload.messages] : payload.messages;
        dialog.latestMessage = dialog.messages[dialog.messages.length];

        state.dialogs[state.currentCompanionId!] = dialog;
    },

    [actions.fetchCreateMessage.fulfilled.type]: (state, {payload}: PayloadAction<{message: Message}>) => {
        const dialog = state.dialogs[state.currentCompanionId!];

        dialog.messages = [...dialog.messages!, payload.message];
        dialog.latestMessage = payload.message;
    },

    [actions.fetchDialog.fulfilled.type]: (state, {payload}: PayloadAction<{dialog: Dialog}>) => {
        const dialog = state.dialogs[state.currentCompanionId!] || {};

        state.dialogs[state.currentCompanionId!] = {...dialog, ...payload.dialog};
    }
  }
);
