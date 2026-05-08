import axios from "axios";
import { getStoredToken } from "../common/utils/authStorage";
import { setupResponseInterceptor } from "./refreshInterceptor";

const BASE_URL = process.env.REACT_APP_API_URL ?? "http://localhost:8000/";

const uploadAxiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 600000, // 10 minutes
});

uploadAxiosClient.interceptors.request.use(
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

setupResponseInterceptor(uploadAxiosClient);

export default uploadAxiosClient;
