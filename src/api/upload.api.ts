import {AxiosPromise} from "axios";

import {request} from "@lib/request";

const upload = (file: FormData): AxiosPromise<void> =>
  request({
    method: "POST",
    url: "/upload",
    data: file
  });

export const uploadApi = {
  upload
};
