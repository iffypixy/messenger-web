import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {AppState} from "redux";

import {IUser} from "@api/common";
import {messageApi} from "@api/message.api";
import {userApi} from "@api/user.api";

const typePrefix = "chat";

export const setSearch = createAction<string>(`${typePrefix}/setSearch`);

export const fetchReadMessages = createAsyncThunk<void, string[]>(`${typePrefix}/fetchReadMessages`, async (ids) => {
    const {data} = await messageApi.readMessages(ids);

    return data;
});

export const fetchNewUsers = createAsyncThunk<{users: IUser[]}, {take: number; query: string}, {state: AppState}>(`${typePrefix}/fetchNewUsers`, async ({take, query}, api) => {
    const {data} = await userApi.getUsersByQuery({take, query});

    const state: AppState = api.getState();

    const companionsIds = Object.values(state.chat.dialogs.data.dialogs).map(({companion}) => companion?.id).filter(Boolean);
    const credentials = state.auth.data.credentials;

    const newUsers =  data.users.filter(({id}) => !companionsIds.includes(id) && credentials!.id !== id);

    return {users: newUsers};
});

export const setNewUsers = createAction<IUser[] | null>(`${typePrefix}/setNewUsers`);