import axios, {AxiosError, CancelToken} from "axios";

import {BACKEND_URL} from "@lib/constants";
import {authApi} from "@api/auth.api";

export interface RequestQuery {
  skip?: number;
  limit?: number;
}

export interface RequestOptions {
  cancelToken?: CancelToken;
  onDownloadProgress?: (progressEvent: any) => void;
  onUploadProgress?: (progressEvent: any) => void;
}

export const request = axios.create({
  baseURL: BACKEND_URL
});

const BAD_STATUS_CODES = [401, 403];

applyInterceptor();

function applyInterceptor() {
  const interceptor = request.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const {config, response} = error;

      if (!response || !BAD_STATUS_CODES.includes(response.status)) return Promise.reject(error);

      request.interceptors.response.eject(interceptor);

      try {
        const {status} = await authApi.refreshTokens();

        if (status === 201) return request(config);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        applyInterceptor();
      }
    }
  );
}