import {AxiosPromise} from "axios";

import {request} from "@lib/request";

const getPresignedUrl = (fileExtension: string): AxiosPromise<{url: string, key: string}> =>
  request({
    method: "POST",
    url: "/upload",
    data: {extension: fileExtension},
    withCredentials: true
  });

interface UploadData {
  file: File;
  url: string;
}

const upload = async ({file, url}: UploadData) =>
  request({
    method: "PUT",
    url,
    headers: {
      "Content-Type": file.type
    },
    data: file
  });

export const uploadApi = {
    getPresignedUrl, upload
};