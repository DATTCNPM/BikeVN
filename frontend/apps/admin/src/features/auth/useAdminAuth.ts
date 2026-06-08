import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { authApi, authAdminApi } from "@repo/api";
import { ROLES } from "@repo/constants";
import { authStorageService, tokenService } from "@repo/services";

import type { LoginPayload } from "@repo/types";

interface AdminAuthState {
  isAdminLogin: boolean;

  loginAdmin: (credentials: LoginPayload) => Promise<boolean>;
  logoutAdmin: () => Promise<boolean>;
  initializeAuth: () => void;
}

const hasAdminAccess = (token: string) => {
  const roles = tokenService.getRoles(token);

  return roles.includes(ROLES.ADMIN) || roles.includes(ROLES.EMPLOYEE);
};

export const useAdminAuth = create<AdminAuthState>()(
  devtools(
    (set) => ({
      isAdminLogin: !!authStorageService.getAdminToken(),

      loginAdmin: async (credentials) => {
        try {
          const auth = await authApi.login(credentials);

          const token = auth.token;

          if (!hasAdminAccess(token)) {
            return false;
          }

          authStorageService.setAdminToken(token);

          set({
            isAdminLogin: true,
          });

          return true;
        } catch {
          return false;
        }
      },

      logoutAdmin: async () => {
        const token = authStorageService.getAdminToken();

        if (token) {
          try {
            await authAdminApi.logout(token);
          } catch {
            // ignore
          }
        }

        authStorageService.clearAdminToken();

        set({
          isAdminLogin: false,
        });

        return true;
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
