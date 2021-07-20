import {createAsyncThunk} from "@reduxjs/toolkit";

import {UpdateProfileData, UpdateProfileResult, profilesApi} from "@api/profiles.api";

const type = "profiles";

export interface FetchUpdatingProfileData extends UpdateProfileData {
}

export interface FetchUpdatingProfilePayload extends UpdateProfileResult {
}

export const fetchUpdatingProfile = createAsyncThunk<FetchUpdatingProfilePayload, FetchUpdatingProfileData>(`${type}/fetchUpdatingProfile`,
  async (args) => {
    const {data} = await profilesApi.updateProfile(args);

    return data;
  });