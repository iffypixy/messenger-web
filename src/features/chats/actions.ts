import {createAction} from "@reduxjs/toolkit";

const type = "chats";

export interface SetSearchingPayload {
  search: string;
}

export const setSearching = createAction<SetSearchingPayload>(`${type}/setSearching`);