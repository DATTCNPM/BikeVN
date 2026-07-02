import axios from "axios";
import { ApiError } from "../error/ApiError";
import type { ApiResponse } from "@repo/types";
import type { AxiosInstance } from "axios";

type CreateAxiosAuthOptions = {
  tokenKey: string;
  refreshTokenKey: string; // Thêm key để lấy refresh token từ localStorage
  loginPath: string;
  onRefreshToken: (
    refreshToken: string,
  ) => Promise<{ accessToken: string; refreshToken: string }>; // Hàm gọi API refresh
};

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
  let failedQueue: any[] = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token);
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

      // 1. Chặn xử lý vòng lặp nếu đây là request REFRESH hoặc LOGIN
      if (
        config.url?.includes("/auth/refresh") ||
        config.url?.includes("/login")
      ) {
        if (data?.code === 1000) return data.result;
        if (typeof data?.code === "number") {
          throw new ApiError(data.code, data.message || "Auth Logic Error");
        }
        return data;
      }

      // 2. Xử lý mã lỗi logic hết hạn token từ Backend (Ví dụ: 5555)
      if (data?.code === 5555 && !config?._retry && !config?.skipAuthCheck) {
        config._retry = true;
        return handleTokenRefresh(config);
      }

      // 3. Xử lý khi API chạy thành công chuẩn chuẩn 1000
      if (data?.code === 1000) return data.result;

      // 4. Các lỗi logic khác từ backend (Ví dụ: 4002, 4003...)
      if (typeof data?.code === "number") {
        throw new ApiError(data.code, data.message || "Logic error");
      }

      return data;
    },
    async (error) => {
      const config = error.config as any;

      // 1. Nếu bản thân request refresh token bị lỗi HTTP (401, 403, 500...), ném lỗi ra ngay
      if (config.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      // 2. Xử lý mã lỗi HTTP chuẩn 401 Unauthorized cho các API thông thường
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
    } catch (refreshError) {
      processQueue(refreshError, null);
      handleUnauthorized(tokenKey, refreshTokenKey, loginPath);
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

  // Sửa từ xóa đơn lẻ sang xóa sạch sẽ theo Key hệ thống
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(refreshTokenKey);

  // Chỉ chuyển hướng nếu user đang KHÔNG ở trang login
  if (!window.location.pathname.startsWith(loginPath)) {
    window.location.href = loginPath;
  }
}
