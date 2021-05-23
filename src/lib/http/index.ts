import axios, {AxiosError} from "axios";

import {BACKEND_URL} from "@lib/constants";
import {authApi} from "@api/auth.api";
import {getFingerprint} from "@lib/fingerprint";

export const request = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true
});

applyAuthInterceptor();

function applyAuthInterceptor() {
  const UNAUTHORIZED_CODES = [401, 403];

  applyInterceptor();

  function applyInterceptor() {
    const interceptor = request.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const {config, response} = error;

        if (!response || !UNAUTHORIZED_CODES.includes(response.status)) {
          return Promise.reject(error);
        }

        request.interceptors.response.eject(interceptor);

        try {
          const fingerprint = await getFingerprint();

          const {status} = await authApi.refreshTokens({fingerprint});

          if (status === 201) return request(config);
        } catch (error) {
          return Promise.reject(error);
        } finally {
          return applyInterceptor();
        }
      }
    );
  }
}
