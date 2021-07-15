import {createAction} from "@reduxjs/toolkit";

const type = "chats";

export interface SetSearchPayload {
  search: string;
}

export const setSearch = createAction<SetSearchPayload>(`${type}/setSearch`);