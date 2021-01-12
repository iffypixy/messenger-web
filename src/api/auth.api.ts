import {AxiosPromise} from "axios";

import {request} from "@lib/request";
import {getFingerprint} from "@lib/fingerprint";
import {User} from "./common";

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const register = async (data: RegisterData): Promise<AxiosPromise<{credentials: User}>> => request({
  url: "/api/auth/register",
  data: {...data, fingerprint: await getFingerprint()},
  method: "POST",
  withCredentials: true
});

export interface LoginData {
  email: string;
  password: string;
}

const login = async (data: LoginData): Promise<AxiosPromise<{credentials: User}>> => request({
  url: "/api/auth/login",
  data: {...data, fingerprint: await getFingerprint()},
  method: "POST",
  withCredentials: true
});

const getCredentials = (): AxiosPromise<{credentials: User}> => request({
  url: "/api/auth/credentials",
  method: "GET",
  withCredentials: true
});

const logout = (): AxiosPromise<void> => request({
  url: "/api/auth/logout",
  method: "POST",
  withCredentials: true
});

const refreshTokens = async (): Promise<AxiosPromise<void>> => request({
  url: "/api/auth/refresh-tokens",
  method: "POST",
  data: {fingerprint: await getFingerprint()},
  withCredentials: true
});

export const authApi = {
  register, login, logout, refreshTokens, getCredentials
};
