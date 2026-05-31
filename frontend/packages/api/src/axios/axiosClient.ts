import axios from "axios";
import { TOKEN_KEYS } from "@repo/constants";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
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
    const config = response.config as any;
    const data = response.data;

    if (config?.skipAuthCheck) {
      return data;
    }

    if (data && (data.code === 401 || data.message === "Unauthenticated")) {
      handleClientUnauthorized();
      return Promise.reject(new Error(data.message || "Unauthenticated"));
    }

    return data;
  },
  (error) => {
    const config = error.config as any;
    const response = error.response;

    if (config?.skipAuthCheck) {
      return Promise.reject(error);
    }

    if (response && (response.status === 401 || response?.data?.code === 401)) {
      handleClientUnauthorized();
    }

    return Promise.reject(error);
  },
);

function handleClientUnauthorized() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEYS.CLIENT);

  const pathname = window.location.pathname;

  if (pathname !== "/login" && pathname !== "/register") {
    window.location.href = "/login";
  }
}

export default axiosClient;
