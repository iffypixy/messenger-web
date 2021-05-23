import {createAsyncThunk} from "@reduxjs/toolkit";

import {authApi, LoginResponse, LoginData, RegisterResponse, RegisterData, GetCredentialsResponse} from "@api/auth.api";

const type = "auth";

export const fetchLogin = createAsyncThunk<LoginResponse, LoginData>(`${type}/fetchLogin`, async (args) => {
    const {data} = await authApi.login(args);

    return data;
});

export const fetchRegister = createAsyncThunk<RegisterResponse, RegisterData>(`${type}/fetchRegister`, async (args) => {
    const {data} = await authApi.register(args);

    return data;
});

export const fetchCredentials = createAsyncThunk<GetCredentialsResponse>(`${type}/fetchCredentials`, async () => {
    const {data} = await authApi.getCredentials();

    return data;
});