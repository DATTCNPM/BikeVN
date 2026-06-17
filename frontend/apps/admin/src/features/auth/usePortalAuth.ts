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
        set({
          isPortalLogin: value,
        });
      },

      logoutPortal: () => {
        authStorageService.clearPortalToken();

        set({
          isPortalLogin: false,
        });
      },

      initializeAuth: () => {
        const token = authStorageService.getPortalToken();

        if (!token) {
          set({
            isPortalLogin: false,
          });

          return;
        }

        if (tokenService.isExpired(token) || !hasAdminAccess(token)) {
          authStorageService.clearPortalToken();

          set({
            isPortalLogin: false,
          });

          return;
        }

        set({
          isPortalLogin: true,
        });
      },
    }),
    {
      name: "portal-auth-store",
    },
  ),
);
