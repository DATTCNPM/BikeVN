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

  // Cơ chế xếp hàng (Queue) để tránh nhiều request gọi refresh token cùng lúc
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

      // Xử lý mã lỗi từ Backend (Ví dụ hệ thống của bạn trả về 5555 làm mã hết hạn token)
      if (data?.code === 5555 && !config?._retry && !config?.skipAuthCheck) {
        config._retry = true;
        return handleTokenRefresh(config);
      }

      if (data?.code === 1000) return data.result;
      if (typeof data?.code === "number") {
        throw new ApiError(data.code, data.message || "Logic error");
      }

      return data;
    },
    async (error) => {
      const config = error.config as any;

      // Xử lý mã lỗi HTTP chuẩn 401 Unauthorized
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

  // Hàm xử lý chung cho cả 2 trường hợp lỗi 401 hoặc Code 5555
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

      // Gọi hàm refresh token được truyền từ ngoài vào
      const res = await onRefreshToken(refreshToken);

      // Ở đây tùy thuộc Backend của bạn trả về data trực tiếp hay bọc trong ApiResponse<T>
      // Giả sử res nhận về dạng { accessToken, refreshToken }
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

  localStorage.removeItem(tokenKey);
  localStorage.removeItem(refreshTokenKey); // Xóa nốt refresh token khi logout

  if (!window.location.pathname.startsWith(loginPath)) {
    window.location.href = loginPath;
  }
}
