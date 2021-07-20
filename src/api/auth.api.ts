import {AxiosPromise} from "axios";

import {Credentials} from "@features/auth";
import {request} from "@lib/http";

export interface LoginData {
    username: string;
    password: string;
    fingerprint: string;
}

export interface LoginResult {
    credentials: Credentials;
}

const login = (data: LoginData): AxiosPromise<LoginResult> => request({
    url: "/auth/login",
    method: "POST", data
});

export interface RegisterData {
    username: string;
    password: string;
    fingerprint: string;
}

export interface RegisterResult {
    credentials: Credentials;
}

const register = (data: RegisterData): AxiosPromise<RegisterResult> => request({
    url: "/auth/register",
    method: "POST", data
});

export interface GetCredentialsResult {
    credentials: Credentials;
}

const getCredentials = (): AxiosPromise<GetCredentialsResult> => request({
    url: "/auth/credentials",
    method: "GET"
});

interface RefreshTokensData {
    fingerprint: string;
}

const refreshTokens = (data: RefreshTokensData): AxiosPromise<void> => request({
    url: "/auth/refresh-tokens",
    method: "POST", data
});

const logout = () => request({
    url: "/auth/logout",
    method: "POST"
});

export const authApi = {
    login, register, getCredentials,
    refreshTokens, logout
};