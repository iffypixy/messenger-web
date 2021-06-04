import {AxiosPromise, AxiosRequestConfig} from "axios";

import {request} from "@lib/http";
import {File as IFile} from "@lib/typings";

interface UploadData {
  file: File;
}

interface UploadResponse {
  file: IFile;
}

const upload = ({file}: UploadData, options: Partial<AxiosRequestConfig> = {}): AxiosPromise<UploadResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  return request({
    url: "/v1/api/upload",
    method: "POST",
    data: formData,
    ...options
  });
}

export const uploadApi = {
  upload
};