import {createAsyncThunk} from "@reduxjs/toolkit";

import {SearchUsersResponse, SearchUsersData, usersApi} from "@api/users.api";

const type = "users";

export interface FetchSearchingUsersData extends SearchUsersData {
}

export interface FetchSearchingUsersPayload extends SearchUsersResponse {
}

export const fetchSearchingUsers = createAsyncThunk<FetchSearchingUsersPayload, FetchSearchingUsersData>(`${type}/fetchUsers`,
  async (args) => {
    const {data} = await usersApi.searchUsers(args);

    return data;
  });