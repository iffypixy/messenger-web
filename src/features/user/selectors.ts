import {AppState} from "redux";

const userSelector = (state: AppState) => state.user;

export const onlineUsersIds = (state: AppState) => userSelector(state).data.onlineUsersIds;