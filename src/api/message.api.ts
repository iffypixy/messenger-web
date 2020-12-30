import {AxiosPromise} from "axios";

import {request} from "@lib/request";

const readMessages = (ids: string[]): AxiosPromise<void> =>
  request({
    method: "PUT",
    url: "/api/messages/read",
    data: {messagesIds: ids},
    withCredentials: true
  });

export const messageApi = {
    readMessages
};
