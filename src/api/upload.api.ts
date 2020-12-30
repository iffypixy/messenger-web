import {AxiosPromise} from "axios";

import {request} from "@lib/request";

const upload = (file: FormData): AxiosPromise<void> =>
  request({
    method: "POST",
    url: "/api/upload",
    data: file,
    withCredentials: true
  });

export const uploadApi = {
  upload
};
