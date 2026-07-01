import { TOKEN_KEYS } from "@repo/constants";

export const authStorageService = {
  // ================= CLIENT TOKENS =================
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.CLIENT_ACCESS);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.CLIENT_REFRESH);
  },
  // Hàm mới: Lưu cả cặp token cho Client cùng lúc
  setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_KEYS.CLIENT_ACCESS, token);
    localStorage.setItem(TOKEN_KEYS.CLIENT_REFRESH, refreshToken);
  },
  // Hàm mới: Xóa cả cặp token của Client khi logout
  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEYS.CLIENT_ACCESS);
    localStorage.removeItem(TOKEN_KEYS.CLIENT_REFRESH);
  },

  // Giữ lại các hàm đơn lẻ cũ nếu có chỗ khác đang dùng độc lập
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEYS.CLIENT_ACCESS, token);
  },
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEYS.CLIENT_ACCESS);
  },

  // ================= PORTAL TOKENS =================
  getPortalToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.PORTAL_ACCESS);
  },
  getPortalRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.PORTAL_REFRESH);
  },
  // Hàm mới: Lưu cả cặp token cho Portal cùng lúc
  setPortalTokens(token: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_KEYS.PORTAL_ACCESS, token);
    localStorage.setItem(TOKEN_KEYS.PORTAL_REFRESH, refreshToken);
  },
  // Hàm mới: Xóa cả cặp token của Portal khi logout
  clearPortalTokens(): void {
    localStorage.removeItem(TOKEN_KEYS.PORTAL_ACCESS);
    localStorage.removeItem(TOKEN_KEYS.PORTAL_REFRESH);
  },

  // Giữ lại các hàm đơn lẻ cũ của Portal
  setPortalToken(token: string): void {
    localStorage.setItem(TOKEN_KEYS.PORTAL_ACCESS, token);
  },
  clearPortalToken(): void {
    localStorage.removeItem(TOKEN_KEYS.PORTAL_ACCESS);
  },
};
