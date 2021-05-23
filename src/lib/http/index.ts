import axios from "axios";

import {BACKEND_URL} from "@lib/constants";

export const request = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true
});

