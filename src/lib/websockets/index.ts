import {io} from "socket.io-client";

import {BACKEND_URL} from "@lib/constants";

export const socket = io(BACKEND_URL, {
  withCredentials: true
});