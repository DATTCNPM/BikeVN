import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { ROLES } from "@repo/constants";
import { authStorageService, tokenService } from "@repo/services";

interface AdminAuthState {
  isPortalLogin: boolean;

  setPortalLogin: (value: boolean) => void;
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

      setPortalLogin: (value) => {
        set({ isPortalLogin: value });
      },

      logoutPortal: () => {
        // SỬA TẠI ĐÂY: Xóa toàn bộ token (Access + Refresh) để tránh rò rỉ quyền
        authStorageService.clearPortalTokens();

        set({ isPortalLogin: false });
      },

      initializeAuth: () => {
        const token = authStorageService.getPortalToken();

        if (!token) {
          set({ isPortalLogin: false });
          return;
        }

        // SỬA TẠI ĐÂY: Nếu token hết hạn hoặc sai quyền, cũng phải dọn sạch cả cặp
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
