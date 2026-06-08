import axios from "axios";

import { TOKEN_KEYS } from "@repo/constants";

import { ApiError } from "../error/ApiError";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEYS.CLIENT);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => {
    const config = response.config as {
      skipAuthCheck?: boolean;
    };

    const data = response.data;

    /**
     * Backend contract:
     * {
     *   code: number;
     *   message: string;
     *   result: T;
     * }
     */

    if (data?.code === 5555) {
      if (!config?.skipAuthCheck) {
        handleClientUnauthorized();
      }

      throw new ApiError(data.code, data.message || "Unauthenticated");
    }

    if (data?.code === 1000) {
      return data.result;
    }

    if (typeof data?.code === "number") {
      throw new ApiError(data.code, data.message || "Logic error");
    }

    /**
     * Fallback cho các endpoint
     * không dùng ApiResponse envelope.
     */
    return data;
  },
  (error) => {
    const config = error.config as {
      skipAuthCheck?: boolean;
    };

    const response = error.response;

    /**
     * HTTP 401
     */
    if (response?.status === 401 && !config?.skipAuthCheck) {
      handleClientUnauthorized();
    }

    return Promise.reject(error);
  },
);

function handleClientUnauthorized() {
  if (typeof window === "undefined") {
    return;
  }

  Object.values(TOKEN_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });

  const pathname = window.location.pathname;

  if (pathname !== "/login" && pathname !== "/register") {
    window.location.href = "/login";
  }
}

export default axiosClient;
