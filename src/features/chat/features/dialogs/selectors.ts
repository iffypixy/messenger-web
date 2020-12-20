import { AppState } from "redux";

const chatDialogsSelector = (state: AppState) => state.chat.dialogs;

export const dialogsSelector = (state: AppState) => chatDialogsSelector(state).data.dialogs;