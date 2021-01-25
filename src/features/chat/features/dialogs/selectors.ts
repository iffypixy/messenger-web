import {AppState} from "redux";

const chatDialogsSelector = (state: AppState) => state.chat.dialogs;

export const dialogSelector = (state: AppState) =>
  chatDialogsSelector(state).data.dialogs[state.chat.dialogs.data.currentCompanionId!];

export const dialogsSelector = (state: AppState) =>
  chatDialogsSelector(state).data.dialogs;

export const listSelector = (state: AppState) =>
  chatDialogsSelector(state).data.list;

export const areDialogsFetchingSelector = (state: AppState) =>
  chatDialogsSelector(state).loading.areDialogsFetching;

export const isCompanionFetchingSelector = (state: AppState) =>
  chatDialogsSelector(state).loading.isCompanionFetching;

export const areMessagesFetchingSelector = (state: AppState) =>
  chatDialogsSelector(state).loading.areMessagesFetching;

export const isAttachmentNumberFetchingSelector = (state: AppState) =>
  chatDialogsSelector(state).loading.isAttachmentNumberFetching;

export const isSidebarOpen = (state: AppState) =>
  chatDialogsSelector(state).data.isSidebarOpen;
