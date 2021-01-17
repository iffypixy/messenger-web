import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {AppState} from "redux";
import axios from "axios";

import {User} from "@api/common";
import {userApi, GetUsersByQuery} from "@api/user.api";

const typePrefix = "chat";

export const fetchQueriedUsers = createAsyncThunk<{users: User[]}, GetUsersByQuery, {state: AppState}>(`${typePrefix}/fetchQueriedUsers`, async ({limit, query}, api) => {
    const source = axios.CancelToken.source();

    api.signal.addEventListener("abort", () => source.cancel());

    const {data} = await userApi.getUsersByQuery({limit, query}, {cancelToken: source.token});

    const state: AppState = api.getState();

    const companionsIds = state.chat.dialogs.data.list?.map(({companion}) => companion?.id).filter(Boolean) || [];
    const credentials = state.auth.data.credentials;

    const users = data.users.filter(({id}) => !companionsIds.includes(id) && credentials!.id !== id);

    return {users};
});

export const setQueriedUsers = createAction<{users: User[]}>(`${typePrefix}/setQueriedUsers`);

export const setSearch = createAction<{search: string}>(`${typePrefix}/setSearch`);