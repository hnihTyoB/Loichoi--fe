import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { APP_CONFIG } from "./constants";

export const apiClient: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  withCredentials: true, // Send HTTP-only cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Optionally attach Bearer token if stored in local state or fallback
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error)
);
