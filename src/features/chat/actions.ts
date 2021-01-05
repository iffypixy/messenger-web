import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {AppState} from "redux";
import axios from "axios";

import {IUser} from "@api/common";
import {messageApi, ReadMessagesData} from "@api/message.api";
import {userApi, GetUsersByQuery} from "@api/user.api";

const typePrefix = "chat";

export const fetchReadMessages = createAsyncThunk<void, ReadMessagesData>(`${typePrefix}/fetchReadMessages`, async ({ids}) => {
    const {data} = await messageApi.readMessages({ids});

    return data;
});

export const fetchQueriedUsers = createAsyncThunk<{users: IUser[]}, GetUsersByQuery, {state: AppState}>(`${typePrefix}/fetchQueriedUsers`, async ({take, query}, api) => {
    const source = axios.CancelToken.source();

    api.signal.addEventListener("abort", () => source.cancel());

    const {data} = await userApi.getUsersByQuery({take, query}, {cancelToken: source.token});

    const state: AppState = api.getState();

    const companionsIds = state.chat.dialogs.data.list?.map(({companion}) => companion?.id).filter(Boolean) || [];
    const credentials = state.auth.data.credentials;

    const users = data.users.filter(({id}) => !companionsIds.includes(id) && credentials!.id !== id);

    return {users};
});

export const setQueriedUsers = createAction<{users: IUser[]}>(`${typePrefix}/setQueriedUsers`);

export const setSearch = createAction<{search: string}>(`${typePrefix}/setSearch`);