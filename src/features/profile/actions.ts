import {createAsyncThunk} from "@reduxjs/toolkit";

import {profileApi, UpdateData} from "@api/profile.api";

const typePrefix = "profile";

export const fetchUpdateProfile = createAsyncThunk(`${typePrefix}/fetchUpdateProfile`, async ({firstName, lastName}: UpdateData) => {
  const {data} = await profileApi.update({firstName, lastName});

  return data;
});