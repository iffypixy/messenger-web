import {createAsyncThunk} from "@reduxjs/toolkit";

import {profileApi, UpdateData} from "@api/profile.api";
import {User} from "@api/common";

const typePrefix = "profile";

export const fetchUpdateProfile = createAsyncThunk<{credentials: User}, UpdateData>(`${typePrefix}/fetchUpdateProfile`, async (args) => {
  const {data} = await profileApi.update(args);

  return data;
});