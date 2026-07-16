import { TOKEN_KEYS } from "@repo/constants";
import { createAxiosAuth } from "@repo/api";
import axios from "axios";

// Tạo một instance phụ riêng biệt CHỈ dành cho việc refresh, tránh loop interceptor
const refreshAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://bikevn.onrender.com",
  timeout: 10000,
});

export const axiosAdmin = createAxiosAuth({
  tokenKey: TOKEN_KEYS.PORTAL_ACCESS,
  refreshTokenKey: TOKEN_KEYS.PORTAL_REFRESH,
  onRefreshToken: async (token) => {
    // Gọi bằng refreshAxios biệt lập
    const res = await refreshAxios.post("/auth/refresh", {
      refreshToken: token,
    });

    // Lúc này res là response gốc của Axios, data sẽ là cục JSON trả về từ backend
    const apiData = res.data;

    if (apiData?.code !== 1000 || !apiData?.result) {
      throw new Error(apiData?.message || "Refresh token không hợp lệ");
    }

    const data = apiData.result;
    const accessToken = data.token || data.accessToken;
    const refreshToken = data.refreshToken;

    if (!accessToken || !refreshToken) {
      throw new Error("Backend trả về thiếu token");
    }

    return { accessToken, refreshToken };
  },
});
