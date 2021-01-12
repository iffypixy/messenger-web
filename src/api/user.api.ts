import {AxiosPromise} from "axios";

import {RequestQuery, request, RequestOptions} from "@lib/request";
import {User, ID} from "./common";

export interface GetUserData {
  id: ID;
}

const getUser = ({id}: GetUserData): AxiosPromise<{user: User}> => request({
  method: "GET",
  url: `/api/users/${id}`,
  withCredentials: true
});

export interface GetUsersByQuery extends RequestQuery {
  query: string;
}

const getUsersByQuery = ({limit, query}: GetUsersByQuery, {cancelToken}: RequestOptions):
  AxiosPromise<{users: User[]}> => request({
  method: "GET",
  url: "/api/users/search",
  withCredentials: true,
  cancelToken,
  params: {
    q: query, limit
  }
});

export const userApi = {
  getUser, getUsersByQuery
};