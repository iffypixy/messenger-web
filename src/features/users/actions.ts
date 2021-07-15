import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {SearchUsersResult, SearchUsersData, usersApi} from "@api/users.api";
import {User} from "@features/users/lib/typings";

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

export interface SetSearchingPayload {
  searching: User[];
}

export const setSearching = createAction<SetSearchingPayload>(`${type}/setSearching`);