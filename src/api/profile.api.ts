import {AxiosPromise} from "axios";

import {request} from "@lib/request";
import {User} from "@api/common";

export interface UpdateData {
  firstName?: string;
  lastName?: string;
  avatar?: Blob;
}

const update = ({avatar, lastName, firstName}: UpdateData): AxiosPromise<{credentials: User}> => {
  const formData = new FormData();

  if (firstName) formData.append("firstName", firstName);
  if (lastName) formData.append("lastName", lastName);
  if (avatar) formData.append("avatar", avatar);

  return request({
    method: "PUT",
    url: "/api/profile/update",
    withCredentials: true,
    data: formData
  });
};

export const profileApi = {
  update
};