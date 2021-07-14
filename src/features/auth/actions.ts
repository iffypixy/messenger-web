import {createAsyncThunk} from "@reduxjs/toolkit";

import {authApi, LoginResult, LoginData, RegisterResult, RegisterData, GetCredentialsResult} from "@api/auth.api";

const type = "auth";

export const fetchLogin = createAsyncThunk<LoginResult, LoginData>(`${type}/fetchLogin`, async (args) => {
    const {data} = await authApi.login(args);

    return data;
});

export const fetchRegister = createAsyncThunk<RegisterResult, RegisterData>(`${type}/fetchRegister`, async (args) => {
    const {data} = await authApi.register(args);

    return data;
});

export const fetchCredentials = createAsyncThunk<GetCredentialsResult>(`${type}/fetchCredentials`, async () => {
    const {data} = await authApi.getCredentials();

    return data;
});