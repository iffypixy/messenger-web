import {AxiosPromise} from "axios";

import {request} from "@lib/request";
import {getFingerprint} from "@lib/fingerprint";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface IRegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const register = async (data: IRegisterData): Promise<AxiosPromise<{credentials: IUser}>> => request({
  url: "/api/auth/register",
  data: {...data, fingerprint: await getFingerprint()},
  method: "POST",
  withCredentials: true
});


export interface ILoginData {
  email: string;
  password: string;
}

const login = async (data: ILoginData): Promise<AxiosPromise<{credentials: IUser}>> => request({
  url: "/api/auth/login",
  data: {...data, fingerprint: await getFingerprint()},
  method: "POST",
  withCredentials: true
});

const getCredentials = (): AxiosPromise<{credentials: IUser}> => request({
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
