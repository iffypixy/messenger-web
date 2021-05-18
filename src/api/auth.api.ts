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

const login = async (data: LoginData): Promise<AxiosPromise<LoginResponse>> => request({
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

const register = async (data: RegisterData): Promise<AxiosPromise<RegisterResponse>> => request({
    url: "/v1/api/auth/register",
    method: "POST", data
});

export const authApi = {
    login, register
};