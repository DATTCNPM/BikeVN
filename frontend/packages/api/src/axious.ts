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
    // Check for admin token first, then fallback to standard client token
    const adminToken = localStorage.getItem(TOKEN_KEYS.ADMIN);
    const clientToken = localStorage.getItem(TOKEN_KEYS.CLIENT);
    const token = adminToken || clientToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => {
    const data = response.data;

    // Check for logical HTTP 200 but custom Unauthenticated (code 401)
    if (data && (data.code === 401 || data.message === "Unauthenticated")) {
      handleUnauthorizedRedirect();
      return Promise.reject(new Error(data.message || "Unauthenticated"));
    }

    return data;
  },
  (error) => {
    const response = error.response;

    // Check if real HTTP status is 401 or 403
    if (
      response &&
      (response.status === 401 || (response.data && response.data.code === 401))
    ) {
      handleUnauthorizedRedirect();
    }

    return Promise.reject(error);
  },
);

function handleUnauthorizedRedirect() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEYS.CLIENT);
    localStorage.removeItem(TOKEN_KEYS.ADMIN);

    const pathname = window.location.pathname;
    // Check if the current route is in the admin app and redirect accordingly
    if (pathname.startsWith("/admin") && !pathname.includes("/admin/login")) {
      window.location.href = "/admin/login";
    } else if (
      !pathname.startsWith("/admin") &&
      pathname !== "/login" &&
      pathname !== "/register"
    ) {
      window.location.href = "/login";
    }
  }
}

export default axiosClient;
