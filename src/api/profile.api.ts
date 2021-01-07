import {AxiosPromise} from "axios";

import {request} from "@lib/request";
import {IUser} from "@api/common";

export interface UpdateData {
  firstName: string;
  lastName: string;
}

const update = ({firstName, lastName}: UpdateData): AxiosPromise<{credentials: IUser}> => request({
  method: "PUT",
  url: "/api/profile/update",
  data: {firstName, lastName},
  withCredentials: true
});

export const profileApi = {
  update
};