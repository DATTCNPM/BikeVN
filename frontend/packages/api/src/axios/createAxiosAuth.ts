import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import type { ApiResponse } from "@repo/types";
import { ApiError } from "../error/ApiError";

type CreateAxiosAuthOptions = {
  tokenKey: string;
  refreshTokenKey: string;
  onRefreshToken: (
    refreshToken: string,
  ) => Promise<{ accessToken: string; refreshToken: string }>;
};

let serverDownCallback: (() => void) | null = null;

export function setServerDownCallback(cb: () => void) {
  serverDownCallback = cb;
}

export function createAxiosAuth({
  tokenKey,
  refreshTokenKey,
  onRefreshToken,
}: CreateAxiosAuthOptions) {
  const instance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://bikevn.onrender.com",
    timeout: 10000,
  });

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }> = [];

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else if (token) prom.resolve(token);
    });
    failedQueue = [];
  };

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(tokenKey);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    async (response): Promise<any> => {
      const config = response.config;
      const data = response.data as ApiResponse<any>;

      // Xử lý riêng cho các request đặc thù auth/refresh hoặc login
      if (
        config.url?.includes("/auth/refresh") ||
        config.url?.includes("/login")
      ) {
        if (data?.code === 1000) return data.result;
        if (typeof data?.code === "number") {
          throw new ApiError(
            data.code,
            data.message || "Auth Logic Error",
            response.status,
          );
        }
        return data;
      }

      // Xử lý thành công chuẩn cho các API thông thường
      if (data?.code === 1000) return data.result;

      if (typeof data?.code === "number") {
        throw new ApiError(
          data.code,
          data.message || "Logic error",
          response.status,
        );
      }

      return data;
    },
    async (error: AxiosError) => {
      const config = error.config;
      const errorData = error.response?.data as ApiResponse<any> | undefined;

      // Nếu backend trả về status 4xx/5xx có chứa cấu trúc code logic của hệ thống
      if (
        errorData &&
        typeof errorData.code === "number" &&
        errorData.code !== 1000
      ) {
        if (
          errorData.code === 5555 &&
          !config?.url?.includes("/auth/refresh")
        ) {
          return handleTokenRefresh(config);
        }
        return Promise.reject(
          new ApiError(
            errorData.code,
            errorData.message || "Logic error",
            error.response?.status,
          ),
        );
      }

      // Xử lý server sập/sleep
      const isServerSleep =
        !error.response || [502, 503, 504].includes(error.response.status);
      if (typeof window !== "undefined" && isServerSleep) {
        serverDownCallback?.();
        return Promise.reject(error);
      }

      if (config?.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      // Xử lý lỗi 401 chuẩn HTTP thông thường cho access token hết hạn
      if (
        error.response?.status === 401 &&
        !config?.url?.includes("/auth/refresh")
      ) {
        return handleTokenRefresh(config);
      }

      return Promise.reject(error);
    },
  );

  async function handleTokenRefresh(originalRequest: any) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem(refreshTokenKey);
      if (!refreshToken) throw new Error("No refresh token available");

      const res = await onRefreshToken(refreshToken);
      const newAccessToken = res.accessToken;
      const newRefreshToken = res.refreshToken;

      localStorage.setItem(tokenKey, newAccessToken);
      localStorage.setItem(refreshTokenKey, newRefreshToken);

      instance.defaults.headers.common["Authorization"] =
        `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);
      return instance(originalRequest);
    } catch (refreshError: any) {
      processQueue(refreshError, null);

      if (!refreshError.response || refreshError.response.status >= 500) {
        serverDownCallback?.();
      } else {
        handleUnauthorized(tokenKey, refreshTokenKey);
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  function handleUnauthorized(tokenKey: string, refreshTokenKey: string) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshTokenKey);

    // 📢 Phát tín hiệu (Custom Event) để tầng UI tự xử lý điều hướng mượt mà
    window.dispatchEvent(new Event("auth:unauthorized"));
  }

  return instance;
}
