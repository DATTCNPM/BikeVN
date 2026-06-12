import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { ROLES } from "@repo/constants";
import { authStorageService, tokenService } from "@repo/services";

interface AdminAuthState {
  isAdminLogin: boolean;

  setAdminLogin: (value: boolean) => void;
  logoutAdmin: () => void;
  initializeAuth: () => void;
}

const hasAdminAccess = (token: string) => {
  const roles = tokenService.getRoles(token);

  return roles.includes(ROLES.ADMIN) || roles.includes(ROLES.EMPLOYEE);
};

export const useAdminAuth = create<AdminAuthState>()(
  devtools(
    (set) => ({
      isAdminLogin: false,

      setAdminLogin: (value) => {
        set({
          isAdminLogin: value,
        });
      },

      logoutAdmin: () => {
        authStorageService.clearAdminToken();

        set({
          isAdminLogin: false,
        });
      },

      initializeAuth: () => {
        const token = authStorageService.getAdminToken();

        if (!token) {
          set({
            isAdminLogin: false,
          });

          return;
        }

        if (tokenService.isExpired(token) || !hasAdminAccess(token)) {
          authStorageService.clearAdminToken();

          set({
            isAdminLogin: false,
          });

          return;
        }

        set({
          isAdminLogin: true,
        });
      },
    }),
    {
      name: "admin-auth-store",
    },
  ),
);
