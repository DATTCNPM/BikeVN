import axios from "axios";

import { TOKEN_KEYS } from "@repo/constants";

import { ApiError } from "../error/ApiError";

const axiosAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 10000,
});

axiosAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEYS.ADMIN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosAdmin.interceptors.response.use(
  (response) => {
    const config = response.config as {
      skipAuthCheck?: boolean;
    };

    const data = response.data;

    /**
     * Backend:
     * code = 5555 => Unauthenticated
     */
    if (data?.code === 5555) {
      if (!config?.skipAuthCheck) {
        handleAdminUnauthorized();
      }

      throw new ApiError(data.code, data.message || "Unauthenticated");
    }

    /**
     * Success
     */
    if (data?.code === 1000) {
      return data.result;
    }

    /**
     * Business error
     */
    if (typeof data?.code === "number") {
      throw new ApiError(data.code, data.message || "Logic error");
    }

    /**
     * Fallback
     */
    return data;
  },
  (error) => {
    const config = error.config as {
      skipAuthCheck?: boolean;
    };

    const response = error.response;

    if (response?.status === 401 && !config?.skipAuthCheck) {
      handleAdminUnauthorized();
    }

    return Promise.reject(error);
  },
);

function handleAdminUnauthorized() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEYS.ADMIN);

  const pathname = window.location.pathname;

  if (!pathname.startsWith("/admin/login")) {
    window.location.href = "/admin/login";
  }
}

export default axiosAdmin;
