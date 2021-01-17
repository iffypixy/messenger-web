import {AxiosPromise} from "axios";

import {request, RequestOptions} from "@lib/request";
import {File} from "./common";

export interface UploadFileData {
  file: Blob;
}

const uploadFile = ({file}: UploadFileData, options?: RequestOptions): AxiosPromise<{file: File}> => {
  const formData = new FormData();

  formData.append("file", file);

  return request({
    method: "POST",
    url: "/api/upload",
    data: formData,
    withCredentials: true,
    ...options
  });
}

export const uploadApi = {
  uploadFile
};
