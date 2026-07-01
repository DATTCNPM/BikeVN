import { TOKEN_KEYS } from "@repo/constants";
import { createAxiosAuth } from "./createAxiosAuth";
import axios from "axios";

export default createAxiosAuth({
  tokenKey: TOKEN_KEYS.CLIENT_ACCESS,
  refreshTokenKey: TOKEN_KEYS.CLIENT_REFRESH,
  loginPath: "/login",
  onRefreshToken: async (token) => {
    // 1. Khớp tên trường 'refreshToken' với Backend
    const res = await axios.post("https://bikevn.onrender.com/auth/refresh", {
      refreshToken: token,
    });

    const data = res.data.result; // Đây chính là AuthenticationResponse từ Backend

    // 2. Khớp đúng tên biến trả về (Ví dụ nếu backend trả về là 'token' thay vì 'accessToken')
    return {
      accessToken: data.token || data.accessToken, // Đảm bảo ăn theo cả 2 trường hợp đặt tên
      refreshToken: data.refreshToken,
    };
  },
});
