import axios, {AxiosError} from "axios";

import {BACKEND_URL} from "@lib/constants";
import {authApi} from "@api/auth.api";

export const request = axios.create({
  baseURL: BACKEND_URL
});

const STATUS_CODES = [401, 403];

applyInterceptor();

function applyInterceptor() {
  const interceptor = request.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const {config, response} = error;

      const status = response!.status;

      if (!STATUS_CODES.includes(status)) return Promise.reject(error);

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