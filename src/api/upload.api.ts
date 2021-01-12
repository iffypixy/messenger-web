import {AxiosPromise} from "axios";

import {request} from "@lib/request";
import {File} from "./common";

export interface UploadFileData {
  file: FormData;
}

const uploadFile = ({file}: UploadFileData): AxiosPromise<{file: File}> => request({
  method: "POST",
  url: "/api/upload",
  data: file,
  withCredentials: true
});

export const uploadApi = {
  uploadFile
};
