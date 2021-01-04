import {AppState} from "redux";

const chatSelector = (state: AppState) => state.chat;

export const searchSelector = (state: AppState) => chatSelector(state).data.search;

export const newUsersSelector = (state: AppState) => chatSelector(state).data.newUsers;

export const areNewUsersFetchingSelector = (state: AppState) => chatSelector(state).loading.areNewUsersFetching;