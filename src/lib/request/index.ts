import axios, {AxiosError} from "axios";

import {authApi} from "@api/auth.api";

export const request = axios.create();

const applyInterceptor = () => {
  const interceptor = request.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const {config: originalRequest} = error;

      const status = error.response!.status;

      if (status !== 401) return Promise.reject(error);

      request.interceptors.response.eject(interceptor);

      try {
        const {status} = await authApi.refreshTokens();

        if (status === 201) return request(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        applyInterceptor();
      }
    }
  );
}
