import {AxiosPromise} from "axios";

import {request} from "@lib/request";
import {User} from "@api/common";

export interface UpdateData {
  firstName: string;
  lastName: string;
  avatar: Blob;
}

const update = (data: UpdateData): AxiosPromise<{credentials: User}> => {
  const formData = new FormData();

  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("avatar", data.avatar);

  return request({
    method: "PUT",
    url: "/api/profile/update",
    withCredentials: true,
    data: formData
  });
}

export const profileApi = {
  update
};