import {createAsyncThunk} from "@reduxjs/toolkit";

import {SearchUsersResult, SearchUsersData, usersApi} from "@api/users.api";

const type = "users";

export interface FetchSearchingUsersData extends SearchUsersData {
}

export interface FetchSearchingUsersPayload extends SearchUsersResult {
}

export const fetchSearchingUsers = createAsyncThunk<FetchSearchingUsersPayload, FetchSearchingUsersData>(`${type}/fetchSearchingUsers`,
  async (args) => {
    const {data} = await usersApi.searchUsers(args);

    return data;
  });