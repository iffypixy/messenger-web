import {createAsyncThunk} from "@reduxjs/toolkit";

import {authApi, ILoginData, IRegisterData} from "@api/auth.api";
import {IUser} from "@api/common";

const typePrefix = "auth";

export const fetchRegister = createAsyncThunk<{credentials: IUser}, IRegisterData>(`${typePrefix}/fetchRegister`, async ({email, firstName, lastName, password}) => {
  const {data} = await authApi.register({email, firstName, lastName, password});

  return data;
});

export const fetchLogin = createAsyncThunk<{credentials: IUser}, ILoginData>(`${typePrefix}/fetchLogin`, async ({email, password}) => {
  const {data} = await authApi.login({email, password});

  return data;
});

export const fetchCredentials = createAsyncThunk<{credentials: IUser}>(`${typePrefix}/fetchCredentials`, async () => {
  const {data} = await authApi.getCredentials();

  return data;
});

export const fetchLogout = createAsyncThunk(`${typePrefix}/fetchLogout`, async () => {
  await authApi.logout();
});

