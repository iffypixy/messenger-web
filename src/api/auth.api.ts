import {AxiosPromise} from "axios";

import {request} from "@lib/request";
import {getFingerprint} from "@lib/fingerprint";
import {IncomingHttpHeaders} from "http";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const register = (data: RegisterData): AxiosPromise<{credentials: User}> => request({
  url: "/auth/register",
  data: {...data, fingerprint: getFingerprint()},
  method: "POST",
  withCredentials: true
});


export interface LoginData {
  email: string;
  password: string;
}

const login = (data: LoginData): AxiosPromise<{credentials: User}> => request({
  url: "/auth/login",
  data: {...data, fingerprint: getFingerprint()},
  method: "POST",
  withCredentials: true
});

interface GetCredentialsData {
  headers?: IncomingHttpHeaders;
}

const getCredentials = ({headers}: GetCredentialsData): AxiosPromise<{credentials: User}> => request({
  url: "/auth/credentials",
  method: "GET",
  withCredentials: true,
  headers
});

const logout = (): AxiosPromise<void> => request({
  url: "/auth/logout",
  method: "POST",
  withCredentials: true
});

const refreshTokens = (): AxiosPromise<void> => request({
  url: "/auth/refresh-tokens",
  method: "POST",
  data: {fingerprint: getFingerprint()},
  withCredentials: true
});

export const authApi = {
  register, login, logout, refreshTokens, getCredentials
};
