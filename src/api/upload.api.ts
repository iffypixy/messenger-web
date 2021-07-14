import {AxiosPromise, AxiosRequestConfig} from "axios";

import {request} from "@lib/http";
import {File} from "@lib/typings";

interface UploadData {
  file: globalThis.File;
}

interface UploadResult {
  file: File;
}

const upload = ({file}: UploadData, options: Partial<AxiosRequestConfig> = {}): AxiosPromise<UploadResult> => {
  const formData = new FormData();

  formData.append("file", file);

  return request({
    url: "/upload",
    method: "POST",
    data: formData,
    ...options
  });
};

export const uploadApi = {
  upload
};