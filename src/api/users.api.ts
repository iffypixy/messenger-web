import {AxiosPromise} from "axios";

import {User} from "@features/users";
import {request} from "@lib/http";

export interface SearchUsersData {
  query: string;
}

export interface SearchUsersResponse {
  users: User[];
}

const searchUsers = (data: SearchUsersData): AxiosPromise<SearchUsersResponse> => request({
  url: "/users/search",
  method: "GET",
  params: data
});

export const usersApi = {
  searchUsers
};