import axios from "axios";
import { getStoredToken } from "../common/utils/authStorage";
import { setupResponseInterceptor } from "./refreshInterceptor";

const BASE_URL = process.env.REACT_APP_API_URL ?? "http://localhost:8000/";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
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

setupResponseInterceptor(axiosClient);

export default axiosClient;
