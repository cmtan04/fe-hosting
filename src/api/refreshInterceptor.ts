import type { InternalAxiosRequestConfig, AxiosInstance } from "axios";
import {
  getStoredRefreshToken,
  setStoredAuth,
  clearStoredAuth,
} from "../common/utils/authStorage";
import { AuthEndPoints } from "./endpoints/auth.endpoint";
import { ROUTER_PATH } from "../router/Route";

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

export const setupResponseInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url === AuthEndPoints.REFRESH) {
          clearStoredAuth();
          globalThis.location.href = ROUTER_PATH.SIGN_IN;
          return Promise.reject(error);
        }

        const refreshTokenValue = getStoredRefreshToken();

        if (!refreshTokenValue) {
          clearStoredAuth();
          globalThis.location.href = ROUTER_PATH.SIGN_IN;
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Dùng chính instance đó để gọi refresh (hoặc dùng axios cơ bản)
          const response = await axiosInstance.post(AuthEndPoints.REFRESH, {
            refresh_token: refreshTokenValue,
          });

          const newAccessToken = response.data.access_token;
          setStoredAuth(newAccessToken, null, true);
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          clearStoredAuth();
          globalThis.location.href = ROUTER_PATH.SIGN_IN;
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
