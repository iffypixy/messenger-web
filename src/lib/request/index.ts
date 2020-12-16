import axios, {AxiosError} from "axios";

import {authApi} from "@api/auth.api";

export const request = axios.create({
  baseURL: process.env.BACKEND_URL
});

const applyInterceptor = () => {
  const interceptor = request.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const {config, response} = error;

      const status = response!.status;

      if (status !== 401) return Promise.reject(error);

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
