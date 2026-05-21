import { TOKEN_KEYS } from "@repo/constants";

export const authStorageService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.CLIENT);
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEYS.CLIENT, token);
  },
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEYS.CLIENT);
  },

  getAdminToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.ADMIN);
  },
  setAdminToken(token: string): void {
    localStorage.setItem(TOKEN_KEYS.ADMIN, token);
  },
  clearAdminToken(): void {
    localStorage.removeItem(TOKEN_KEYS.ADMIN);
  },
};
