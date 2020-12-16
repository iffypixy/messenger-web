import {createAsyncThunk} from "@reduxjs/toolkit";

import {authApi, LoginData, RegisterData, User} from "@api/auth.api";

const typePrefix = "auth";

export const fetchRegister = createAsyncThunk<{credentials: User}, RegisterData>(`${typePrefix}/fetchRegister`, async (registerData) => {
  const {data} = await authApi.register(registerData);

  return data;
});

export const fetchLogin = createAsyncThunk<{credentials: User}, LoginData>(`${typePrefix}/fetchLogin`, async (loginData) => {
  const {data} = await authApi.login(loginData);

  return data;
});

export const fetchCredentials = createAsyncThunk<{credentials: User}>(`${typePrefix}/fetchCredentials`, async () => {
  const {data} = await authApi.getCredentials({});

  return data;
});

export const fetchLogout = createAsyncThunk(`${typePrefix}/fetchLogout`, async () => {
  await authApi.logout();
});

