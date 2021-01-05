import {AxiosPromise} from "axios";

import {request} from "@lib/request";
import {ID} from "@api/common";

export interface ReadMessagesData {
  ids: ID[];
}

const readMessages = ({ids}: ReadMessagesData): AxiosPromise<void> => request({
  method: "PUT",
  url: "/api/messages/read",
  data: {ids},
  withCredentials: true
});

export const messageApi = {
  readMessages
};
