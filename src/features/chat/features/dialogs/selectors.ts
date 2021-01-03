import {AppState} from "redux";

const chatDialogsSelector = (state: AppState) => state.chat.dialogs;

export const dialogSelector = (state: AppState) =>
  chatDialogsSelector(state).data.dialogs[state.chat.dialogs.data.currentCompanionId!];

export const listSelector = (state: AppState) =>
  chatDialogsSelector(state).data.list;

export const areDialogsFetchingSelector = (state: AppState) =>
  chatDialogsSelector(state).loading.areDialogsFetching;

export const isCompanionFetchingSelector = (state: AppState) =>
  chatDialogsSelector(state).loading.isCompanionFetching;

export const areMessagesFetchingSelector = (state: AppState) =>
  chatDialogsSelector(state).loading.areMessagesFetching;