import axios, {AxiosError, AxiosPromise} from "axios";

import {BACKEND_URL} from "@lib/constants";
import {authApi} from "@api/auth.api";
import {getFingerprint} from "@lib/fingerprint";

export const request = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true
});

export const CODES = {
  UNAUTHORIZED: [401, 403],
  SUCCESSFUL: [204, 201, 200]
};

useAuthInterceptor();

function useAuthInterceptor() {
  useInterceptor();

  function useInterceptor() {
    const interceptor = request.interceptors.response.use(
      (response) => response,
      async (error: AxiosError): Promise<AxiosPromise | void> => {
        const {config, response} = error;

        const isError = !response || !CODES.UNAUTHORIZED.includes(response.status);

        if (isError) return Promise.reject(error);

        request.interceptors.response.eject(interceptor);

        try {
          const fingerprint = await getFingerprint();

          const {status} = await authApi.refreshTokens({fingerprint});

          const isSuccessful = CODES.SUCCESSFUL.includes(status);

          if (isSuccessful) return request(config);
        } catch (error) {
          return Promise.reject(error);
        } finally {
          useInterceptor();
        }
      }
    );
  }
}
