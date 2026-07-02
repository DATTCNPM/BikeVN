import { TOKEN_KEYS } from "@repo/constants";
import { createAxiosAuth } from "./createAxiosAuth";
import axios from "axios";

export default createAxiosAuth({
  tokenKey: TOKEN_KEYS.CLIENT_ACCESS,
  refreshTokenKey: TOKEN_KEYS.CLIENT_REFRESH,
  loginPath: "/login",
  onRefreshToken: async (token) => {
    try {
      const res = await axios.post("https://bikevn.onrender.com/auth/refresh", {
        refreshToken: token,
      });

      // 1. Kiểm tra mã lỗi logic của hệ thống bạn (Ví dụ: 1000 là thành công)
      if (res.data?.code !== 1000 || !res.data?.result) {
        throw new Error(
          res.data?.message || "Refresh token không hợp lệ hoặc đã hết hạn",
        );
      }

      const data = res.data.result;
      const accessToken = data.token || data.accessToken;
      const refreshToken = data.refreshToken;

      // 2. Bắt buộc phải có đủ 2 token mới cho đi tiếp
      if (!accessToken || !refreshToken) {
        throw new Error("Backend trả về thiếu accessToken hoặc refreshToken");
      }

      return { accessToken, refreshToken };
    } catch (error) {
      // Ném lỗi ra ngoài để handleTokenRefresh nhảy vào block catch và chạy handleUnauthorized
      throw error;
    }
  },
});
