import {createReducer, Reducer} from "@reduxjs/toolkit";

import * as actions from "../actions";

interface InitialState {
  areDialogsFetching: boolean;
  areMessagesFetching: boolean;
  isCreateMessageFetching: boolean;
  isCompanionFetching: boolean;
  isAttachmentNumberFetching: boolean;
}

export const loadingReducer: Reducer<InitialState> = createReducer<InitialState>(
  {
    areDialogsFetching: false,
    areMessagesFetching: false,
    isCreateMessageFetching: false,
    isCompanionFetching: false,
    isAttachmentNumberFetching: false
  },
  {
    [actions.fetchDialogs.pending.type]: (state) => {
      state.areDialogsFetching = true;
    },

    [actions.fetchDialogs.fulfilled.type]: (state) => {
      state.areDialogsFetching = false;
    },

    [actions.fetchDialogs.rejected.type]: (state) => {
      state.areDialogsFetching = false;
    },

    [actions.fetchMessages.pending.type]: (state) => {
      state.areMessagesFetching = true;
    },

    [actions.fetchMessages.fulfilled.type]: (state) => {
      state.areMessagesFetching = false;
    },

    [actions.fetchMessages.rejected.type]: (state) => {
      state.areMessagesFetching = false;
    },

    [actions.fetchCreateMessage.pending.type]: (state) => {
      state.isCreateMessageFetching = true;
    },

    [actions.fetchCreateMessage.fulfilled.type]: (state) => {
      state.isCreateMessageFetching = false;
    },

    [actions.fetchCreateMessage.rejected.type]: (state) => {
      state.isCreateMessageFetching = false;
    },

    [actions.fetchCompanion.pending.type]: (state) => {
      state.isCompanionFetching = true;
    },

    [actions.fetchCompanion.fulfilled.type]: (state) => {
      state.isCompanionFetching = false;
    },

    [actions.fetchCompanion.rejected.type]: (state) => {
      state.isCompanionFetching = false;
    },

    [actions.fetchAttachmentNumber.pending.type]: (state) => {
      state.isAttachmentNumberFetching = true;
    },

    [actions.fetchAttachmentNumber.fulfilled.type]: (state) => {
      state.isAttachmentNumberFetching = false;
    },

    [actions.fetchAttachmentNumber.rejected.type]: (state) => {
      state.isAttachmentNumberFetching = false;
    }
  }
);
