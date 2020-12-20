import {AppState} from "redux";

const chatSelector = (state: AppState) => state.chat;

export const searchSelector = (state: AppState) => chatSelector(state).data.search;