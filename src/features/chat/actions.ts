import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {messageApi} from "@api/message.api";

const typePrefix = "chat";

export const setSearch = createAction<string>(`${typePrefix}/setSearch`);

export const fetchReadMessages = createAsyncThunk<void, string[]>(`${typePrefix}/fetchReadMessages`, async (ids) => {
    const {data} = await messageApi.readMessages(ids);

    return data;
});