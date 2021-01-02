import {AxiosPromise} from "axios";

import {request} from "@lib/request";
import {IUser} from "./common";

const getUser = (id: string): AxiosPromise<{user: IUser}> => request({
  method: "GET",
  url: `/api/users/${id}`,
  withCredentials: true
});

export const userApi = {
  getUser
};