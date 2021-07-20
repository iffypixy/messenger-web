import {AxiosPromise} from "axios";

import {Credentials} from "@features/auth";
import {request} from "@lib/http";

export interface UpdateProfileData {
  avatar?: globalThis.File;
  username?: string;
}

export interface UpdateProfileResult {
  credentials: Credentials;
}

export const updateProfile = ({avatar, username}: UpdateProfileData): AxiosPromise<UpdateProfileResult> => {
  const formData = new FormData();

  if (avatar) formData.append("avatar", avatar);
  if (username) formData.append("username", username);

  return request({
    url: "/profile/update",
    method: "PUT", data: formData
  });
}

export const profilesApi = {
  updateProfile
};