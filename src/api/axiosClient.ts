import axios, { type InternalAxiosRequestConfig } from "axios";
import { ROUTER_PATH } from "../router/Route";
import {
  getStoredToken,
  getStoredRefreshToken,
  setStoredAuth,
  clearStoredAuth,
} from "../common/utils/authStorage";
import { AuthEndPoints } from "./endpoints/auth.endpoint";

const BASE_URL = process.env.REACT_APP_API_URL ?? "http://localhost:8000/";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- Refresh token logic ---
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  for (const prom of failedQueue) {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  }
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Chỉ xử lý 401 và request chưa từng retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Không retry cho chính endpoint refresh (tránh vòng lặp vô hạn)
      if (originalRequest.url === AuthEndPoints.REFRESH) {
        clearStoredAuth();
        globalThis.location.href = ROUTER_PATH.SIGN_IN;
        return Promise.reject(error);
      }

      const refreshTokenValue = getStoredRefreshToken();

      // Không có refresh token → redirect login
      if (!refreshTokenValue) {
        clearStoredAuth();
        console.error("Unauthorized access. Redirecting to login.");
        globalThis.location.href = ROUTER_PATH.SIGN_IN;
        return Promise.reject(error);
      }

      // Nếu đang refresh → xếp request vào hàng đợi
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosClient.post(AuthEndPoints.REFRESH, {
          refresh_token: refreshTokenValue,
        });

        const newAccessToken = response.data.access_token;

        // Lưu access token mới (luôn vào localStorage vì có refresh token = đã remember)
        setStoredAuth(newAccessToken, null, true);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearStoredAuth();
        console.error("Refresh token expired. Redirecting to login.");
        globalThis.location.href = ROUTER_PATH.SIGN_IN;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  },
);

export default axiosClient;
