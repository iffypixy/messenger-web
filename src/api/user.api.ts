import {AxiosPromise} from "axios";

import {IRequestQuery, request} from "@lib/request";
import {IUser} from "./common";

const getUser = (id: string): AxiosPromise<{user: IUser}> => request({
  method: "GET",
  url: `/api/users/${id}`,
  withCredentials: true
});

const getUsersByQuery = ({take, query}: IRequestQuery & {query: string}): AxiosPromise<{users: IUser[]}> => request({
  method: "GET",
  url: "/api/users/search",
  withCredentials: true,
  params: {
    q: query,
    limit: take
  }
})

export const userApi = {
  getUser, getUsersByQuery
};