import {AxiosPromise} from "axios";

import {request} from "@lib/request";
import {getFingerprint} from "@lib/fingerprint";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const register = (data: RegisterData): AxiosPromise<User> => request({
  url: "/api/auth/register",
  data: {...data, fingerprint: getFingerprint()},
  withCredentials: true
});

interface LoginData {
  email: string;
  password: string;
}

const login = (data: LoginData): AxiosPromise<User> => request({
  url: "/api/auth/login",
  data: {...data, fingerprint: getFingerprint()},
  withCredentials: true
});

const logout = (): AxiosPromise<void> => request({
  url: "/api/auth/logout",
  withCredentials: true
});

const refreshTokens = (): AxiosPromise<void> => request({
  url: "/api/auth/refresh-tokens",
  data: {fingerprint: getFingerprint()},
  withCredentials: true
});

export const authApi = {
  register, login, logout, refreshTokens
};
