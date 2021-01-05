import {AppState} from "redux";

const chatSelector = (state: AppState) => state.chat;

export const searchSelector = (state: AppState) => chatSelector(state).data.search;

export const queriedUsersSelector = (state: AppState) => chatSelector(state).data.queriedUsers;

export const areQueriedUsersFetchingSelector = (state: AppState) => chatSelector(state).loading.areQueriedUsersFetching;