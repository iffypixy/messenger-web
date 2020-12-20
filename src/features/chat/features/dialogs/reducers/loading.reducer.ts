import {createReducer} from "@reduxjs/toolkit";

import * as actions from "../actions";


interface InitialState {
    areDialogsFetching: boolean;
    areMessagesFetching: boolean;
    isCreateMessageFetching: boolean;
    isDialogFetching: boolean;
}

export const loadingReducer = createReducer<InitialState>(
  {
      areDialogsFetching: false,
      areMessagesFetching: false,
      isCreateMessageFetching: false,
      isDialogFetching: false
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

    [actions.fetchDialog.pending.type]: (state) => {
        state.isDialogFetching = true;
    },

    [actions.fetchDialog.fulfilled.type]: (state) => {
        state.isDialogFetching = false;
    },

    [actions.fetchDialog.rejected.type]: (state) => {
        state.isDialogFetching = false;
    }
  }
);
