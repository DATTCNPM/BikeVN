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
    // Lấy config của request ra để kiểm tra cờ custom
    const config = response.config as any;
    const data = response.data;

    // Nếu request có cờ skipAuthCheck, cho phép đi qua thẳng, không can thiệp
    if (config?.skipAuthCheck) {
      return data;
    }

    // Check cho logical HTTP 200 nhưng custom Unauthenticated (code 401)
    if (data && (data.code === 401 || data.message === "Unauthenticated")) {
      handleUnauthorizedRedirect();
      return Promise.reject(new Error(data.message || "Unauthenticated"));
    }

    return data;
  },
  (error) => {
    const config = error.config as any;
    const response = error.response;

    // Nếu lỗi HTTP thực tế (401/403) nhưng có cờ skipAuthCheck, trả lỗi về cho hàm gọi tự xử lý
    if (config?.skipAuthCheck) {
      return Promise.reject(error);
    }

    // Check nếu real HTTP status is 401 hoặc 403
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
