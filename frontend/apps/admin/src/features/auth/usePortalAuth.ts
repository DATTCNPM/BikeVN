import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ROLES } from "@repo/constants";
import { authStorageService, tokenService } from "@repo/services";

interface AdminAuthState {
  isPortalLogin: boolean;
  isServerDown: boolean; // ✨ ĐÃ THÊM

  setPortalLogin: (value: boolean) => void;
  setIsServerDown: (value: boolean) => void; // ✨ ĐÃ THÊM
  logoutPortal: () => void;
  initializeAuth: () => void;
}

const hasAdminAccess = (token: string) => {
  const roles = tokenService.getRoles(token);
  return roles.includes(ROLES.ADMIN) || roles.includes(ROLES.EMPLOYEE);
};

export const usePortalAuth = create<AdminAuthState>()(
  devtools(
    (set) => ({
      isPortalLogin: !!authStorageService.getPortalToken(),

      // ✨ ĐÃ THÊM: Đọc trạng thái ban đầu của server từ session
      isServerDown:
        typeof window !== "undefined"
          ? sessionStorage.getItem("server_is_collapsed") === "true"
          : false,

      setPortalLogin: (value) => {
        set({ isPortalLogin: value });
      },

      // ✨ ĐÃ THÊM: Hàm cập nhật và đồng bộ trạng thái server sập
      setIsServerDown: (value) => {
        if (typeof window !== "undefined") {
          if (value) {
            sessionStorage.setItem("server_is_collapsed", "true");
          } else {
            sessionStorage.removeItem("server_is_collapsed");
          }
        }
        set({ isServerDown: value });
      },

      logoutPortal: () => {
        authStorageService.clearPortalTokens();
        set({ isPortalLogin: false });
      },

      initializeAuth: () => {
        const token = authStorageService.getPortalToken();

        if (!token) {
          set({ isPortalLogin: false });
          return;
        }

        if (tokenService.isExpired(token) || !hasAdminAccess(token)) {
          authStorageService.clearPortalTokens();
          set({ isPortalLogin: false });
          return;
        }

        set({ isPortalLogin: true });
      },
    }),
    { name: "portal-auth-store" },
  ),
);
