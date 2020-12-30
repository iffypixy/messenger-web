import {AppState} from "redux";

const chatDialogsSelector = (state: AppState) => state.chat.dialogs;

export const dialogSelector = (state: AppState) =>
  chatDialogsSelector(state).data.dialogs[
    state.chat.dialogs.data.currentCompanionId!
  ];

export const listSelector = (state: AppState) =>
  chatDialogsSelector(state).data.list;
