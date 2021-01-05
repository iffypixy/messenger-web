import {AxiosPromise} from "axios";

import {IRequestQuery, request, IRequestOptions} from "@lib/request";
import {IUser, ID} from "./common";


export interface GetUserData {
  id: ID;
}

const getUser = ({id}: GetUserData): AxiosPromise<{user: IUser}> => request({
  method: "GET",
  url: `/api/users/${id}`,
  withCredentials: true
});

export interface GetUsersByQuery extends IRequestQuery {
  query: string;
}

const getUsersByQuery = ({take, query}: GetUsersByQuery, {cancelToken}: IRequestOptions):
  AxiosPromise<{users: IUser[]}> => request({
  method: "GET",
  url: "/api/users/search",
  withCredentials: true,
  cancelToken,
  params: {
    q: query,
    limit: take
  }
});

export const userApi = {
  getUser, getUsersByQuery
};