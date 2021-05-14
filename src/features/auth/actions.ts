import {createAsyncThunk} from "@reduxjs/toolkit";

import {login, LoginResponse, LoginData, register, RegisterResponse, RegisterData} from "@api/auth.api";

const type = "auth";

export const fetchLogin = createAsyncThunk<LoginResponse, LoginData>(`${type}/fetchLogin`, async (args) => {
    const {data} = await login(args);

    return data;
});

export const fetchRegister = createAsyncThunk<RegisterResponse, RegisterData>(`${type}/fetchRegister`, async (args) => {
    const {data} = await register(args);

    return data;
});