import {createAsyncThunk} from "@reduxjs/toolkit";

import {authApi, ILoginData, IRegisterData, IUser} from "@api/auth.api";

const typePrefix = "auth";

export const fetchRegister = createAsyncThunk<{credentials: IUser}, IRegisterData>(`${typePrefix}/fetchRegister`, async (registerData) => {
  const {data} = await authApi.register(registerData);

  return data;
});

export const fetchLogin = createAsyncThunk<{credentials: IUser}, ILoginData>(`${typePrefix}/fetchLogin`, async (loginData) => {
  const {data} = await authApi.login(loginData);

  return data;
});

export const fetchCredentials = createAsyncThunk<{credentials: IUser}>(`${typePrefix}/fetchCredentials`, async () => {
  const {data} = await authApi.getCredentials();

  return data;
});

export const fetchLogout = createAsyncThunk(`${typePrefix}/fetchLogout`, async () => {
  await authApi.logout();
});

