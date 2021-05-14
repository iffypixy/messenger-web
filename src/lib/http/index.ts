import axios from "axios";

const url = "http://localhost:5000";

export const request = axios.create({
    baseURL: url,
    withCredentials: true
});
