import {io} from "socket.io-client";

import {BACKEND_URL} from "@lib/constants";

export let socket = io(BACKEND_URL, {
  withCredentials: true,
  autoConnect: false
});