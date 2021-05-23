import {AxiosPromise} from "axios";

import {Credentials} from "@features/auth";
import {request} from "@lib/http";

export interface LoginData {
    username: string;
    password: string;
    fingerprint: string;
}

export interface LoginResponse {
    credentials: Credentials;
}

const login = (data: LoginData): AxiosPromise<LoginResponse> => request({
    url: "/v1/api/auth/login",
    method: "POST", data
});

export interface RegisterData {
    username: string;
    password: string;
    fingerprint: string;
}

export interface RegisterResponse {
    credentials: Credentials;
}

const register = (data: RegisterData): AxiosPromise<RegisterResponse> => request({
    url: "/v1/api/auth/register",
    method: "POST", data
});

export interface GetCredentialsResponse {
    credentials: Credentials;
}

const getCredentials = (): AxiosPromise<GetCredentialsResponse> => request({
    url: "/v1/api/auth/credentials",
    method: "GET"
});

export const authApi = {
    login, register, getCredentials
};