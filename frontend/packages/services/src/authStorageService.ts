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

  getPortalToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.PORTAL);
  },
  setPortalToken(token: string): void {
    localStorage.setItem(TOKEN_KEYS.PORTAL, token);
  },
  clearPortalToken(): void {
    localStorage.removeItem(TOKEN_KEYS.PORTAL);
  },
};
