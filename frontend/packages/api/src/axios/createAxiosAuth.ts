import axios from "axios";

import { ApiError } from "../error/ApiError";
import type { ApiResponse } from "@repo/types";

type CreateAxiosAuthOptions = {
  tokenKey: string;
  loginPath: string;
};

export function createAxiosAuth({
  tokenKey,
  loginPath,
}: CreateAxiosAuthOptions) {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
    timeout: 10000,
  });

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
    (response) => {
      const config = response.config as {
        skipAuthCheck?: boolean;
      };

      const data = response.data as ApiResponse<any>;

      if (data?.code === 5555) {
        if (!config?.skipAuthCheck) {
          handleUnauthorized(tokenKey, loginPath);
        }

        throw new ApiError(data.code, data.message || "Unauthenticated");
      }

      if (data?.code === 1000) {
        return data.result;
      }

      if (typeof data?.code === "number") {
        throw new ApiError(data.code, data.message || "Logic error");
      }

      return data;
    },
    (error) => {
      const config = error.config as {
        skipAuthCheck?: boolean;
      };

      if (error.response?.status === 401 && !config?.skipAuthCheck) {
        handleUnauthorized(tokenKey, loginPath);
      }

      return Promise.reject(error);
    },
  );

  return instance;
}

function handleUnauthorized(tokenKey: string, loginPath: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(tokenKey);

  if (!window.location.pathname.startsWith(loginPath)) {
    window.location.href = loginPath;
  }
}
