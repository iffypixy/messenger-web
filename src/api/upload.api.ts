import {AxiosPromise} from "axios";

import {request} from "@lib/request";
import {IFile} from "./common";

interface UploadFileData {
  file: FormData;
}

const uploadFile = ({file}: UploadFileData): AxiosPromise<{file: IFile}> => request({
  method: "POST",
  url: "/api/upload",
  data: file,
  withCredentials: true
});

export const uploadApi = {
  uploadFile
};
