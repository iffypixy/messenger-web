import {AxiosPromise} from "axios";

import {User} from "@features/users";
import {request} from "@lib/http";

export interface SearchUsersData {
  query: string;
}

export interface SearchUsersResult {
  users: User[];
}

const searchUsers = (data: SearchUsersData): AxiosPromise<SearchUsersResult> => request({
  url: "/users/search",
  method: "GET",
  params: data
});

export const usersApi = {
  searchUsers
};