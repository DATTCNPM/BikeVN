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
  // ✨ SỬA: failedQueue chứa các callback nhận vào token
  let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  // ✨ SỬA: Hàm xử lý queue chuẩn
  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else if (token) {
        prom.resolve(token);
      }
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

      // 💡 Nếu backend trả về code hết hạn qua response body thành công (200 OK)
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

      if (
        typeof window !== "undefined" &&
        (!error.response || error.response.status >= 500)
      ) {
        if (window.location.pathname !== "/server-error") {
          sessionStorage.setItem("server_is_collapsed", "true");
          window.location.href = "/server-error";
          return Promise.reject(error);
        }
      }

      if (config.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      // 💡 Nếu backend trả về lỗi 401 Unauthorized chuẩn HTTP
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
    // ✨ SỬA: Nếu đang refresh, chặn request lại và đưa vào hàng đợi
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          // Gọi lại chính request này với token mới
          return instance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem(refreshTokenKey);
      if (!refreshToken) throw new Error("No refresh token available");

      // Gọi hàm refresh token bên ngoài truyền vào
      const res = await onRefreshToken(refreshToken);

      const newAccessToken = res.accessToken;
      const newRefreshToken = res.refreshToken;

      localStorage.setItem(tokenKey, newAccessToken);
      localStorage.setItem(refreshTokenKey, newRefreshToken);

      // Cập nhật token cho instance chung phòng trường hợp có request mới tạo hoàn toàn
      instance.defaults.headers.common["Authorization"] =
        `Bearer ${newAccessToken}`;

      // Cập nhật token cho request hiện tại đang bị lỗi
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // ✨ Kích hoạt giải phóng hàng đợi với token mới
      processQueue(null, newAccessToken);

      // Thực thi lại request gốc ban đầu
      return instance(originalRequest);
    } catch (refreshError: any) {
      // Nếu refresh lỗi, hủy toàn bộ hàng đợi
      processQueue(refreshError, null);

      if (
        typeof window !== "undefined" &&
        (!refreshError.response || refreshError.response.status >= 500)
      ) {
        sessionStorage.setItem("server_is_collapsed", "true");
        window.location.href = "/server-error";
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

  localStorage.removeItem(tokenKey);
  localStorage.removeItem(refreshTokenKey);

  if (!window.location.pathname.startsWith(loginPath)) {
    window.location.href = loginPath;
  }
}
