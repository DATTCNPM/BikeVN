import axios from "axios";
import { ApiError } from "../error/ApiError";
import type { ApiResponse } from "@repo/types";
import type { AxiosInstance } from "axios";

type CreateAxiosAuthOptions = {
  tokenKey: string;
  refreshTokenKey: string;
  loginPath: string;
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
  loginPath,
  onRefreshToken,
}: CreateAxiosAuthOptions) {
  const instance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://bikevn.onrender.com",
    timeout: 10000,
  });

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  const processQueue = (error: any, token: string | null = null) => {
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
      const config = response.config as any;
      const data = response.data as ApiResponse<any>;

      // 1. Kiểm tra mã lỗi hết hạn token TRƯỚC (Ví dụ backend quy định code 5555 là expired)
      if (data?.code === 5555 && !config?._retry && !config?.skipAuthCheck) {
        // Nếu chính request refresh mà cũng trả về 5555 thì không refresh nữa, tránh lặp vô hạn
        if (config.url?.includes("/auth/refresh")) {
          throw new ApiError(data.code, "Refresh token đã hết hạn");
        }
        config._retry = true;
        return handleTokenRefresh(config);
      }

      // 2. Xử lý riêng cho các request đặc thù auth/refresh hoặc login
      if (
        config.url?.includes("/auth/refresh") ||
        config.url?.includes("/login")
      ) {
        if (data?.code === 1000) return data.result; // Trả về result thô để hàm onRefreshToken nhận đúng cấu trúc
        if (typeof data?.code === "number") {
          throw new ApiError(data.code, data.message || "Auth Logic Error");
        }
        return data;
      }

      // 3. Xử lý thành công chuẩn cho các API thông thường
      if (data?.code === 1000) return data.result;

      if (typeof data?.code === "number") {
        throw new ApiError(data.code, data.message || "Logic error");
      }

      return data;
    },
    async (error) => {
      const config = error.config as any;

      const isServerSleep =
        !error.response || [502, 503, 504].includes(error.response?.status);
      if (typeof window !== "undefined" && isServerSleep) {
        serverDownCallback?.();
        return Promise.reject(error);
      }

      // Nếu API /auth/refresh bị lỗi HTTP (Ví dụ 401, 403, 400), ném lỗi thẳng ra để đá về login
      if (config.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      // Xử lý lỗi 401 chuẩn HTTP thông thường cho access token hết hạn
      if (
        error.response?.status === 401 &&
        !config?._retry &&
        !config?.skipAuthCheck
      ) {
        config._retry = true;
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

      // Nếu refresh token dính lỗi mạng khi gọi, báo sập server, ngược lại đá về login
      if (!refreshError.response || refreshError.response.status >= 500) {
        serverDownCallback?.();
      } else {
        handleUnauthorized(tokenKey, refreshTokenKey, loginPath);
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return instance;
}

function handleUnauthorized(
  tokenKey: string,
  refreshTokenKey: string,
  loginPath: string,
) {
  if (typeof window === "undefined") return;
  console.log(
    "🚀 ~ file: createAxiosAuth.ts:174 ~ handleUnauthorized ~ Logging out user",
  );
  console.log(
    "🚀 ~ file: createAxiosAuth.ts:175 ~ handleUnauthorized ~ Clearing tokens and redirecting to login",
  );
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(refreshTokenKey);
  console.log(
    "🚀 ~ file: createAxiosAuth.ts:176 ~ handleUnauthorized ~ Redirecting to login",
  );
  if (!window.location.pathname.startsWith(loginPath)) {
    window.location.href = loginPath;
  }
}
