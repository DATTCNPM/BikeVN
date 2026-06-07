import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authApi, authAdminApi } from "@repo/api";
import { authStorageService, tokenService } from "@repo/services";
import { ROLES } from "@repo/constants";
import type { User } from "@repo/types";
import type { LoginPayload } from "@repo/types";

interface AdminAuthState {
  isAdminLogin: boolean;
  adminProfile: User | null;
  loading: boolean;
  error: string | null;

  loginAdmin: (credentials: LoginPayload) => Promise<boolean>;
  logoutAdmin: () => Promise<boolean>;
  fetchAdminProfile: () => Promise<void>;
  setError: (msg: string | null) => void;
}

export const useAdminAuth = create<AdminAuthState>()(
  devtools(
    (set) => ({
      isAdminLogin: !!authStorageService.getAdminToken(),
      adminProfile: null,
      loading: false,
      error: null,

      loginAdmin: async (credentials) => {
        set({
          loading: true,
          error: null,
        });

        try {
          const auth = await authApi.login(credentials);

          const token = auth.token;

          const roles = tokenService.getRoles(token);

          const hasAdminAccess =
            roles.includes(ROLES.ADMIN) || roles.includes(ROLES.EMPLOYEE);

          if (!hasAdminAccess) {
            set({
              error: "Tài khoản không có quyền quản trị viên",
            });

            return false;
          }

          authStorageService.setAdminToken(token);

          const profile = await authAdminApi.getProfile();

          set({
            isAdminLogin: true,
            adminProfile: profile,
          });

          return true;
        } catch (err: any) {
          set({
            error: err?.message || "Sai tài khoản hoặc mật khẩu",
          });

          return false;
        } finally {
          set({
            loading: false,
          });
        }
      },

      logoutAdmin: async () => {
        set({ loading: true });
        const token = authStorageService.getAdminToken();
        if (token) {
          try {
            await authAdminApi.logout(token);
          } catch (err) {
            console.error("Admin logout failed:", err);
          }
        }
        authStorageService.clearAdminToken();
        set({ isAdminLogin: false, adminProfile: null, error: null });
        return true;
      },

      fetchAdminProfile: async () => {
        const token = authStorageService.getAdminToken();

        if (!token) {
          return;
        }

        set({
          loading: true,
        });

        try {
          const roles = tokenService.getRoles(token);

          const hasAdminAccess =
            roles.includes(ROLES.ADMIN) || roles.includes(ROLES.EMPLOYEE);

          if (!hasAdminAccess || tokenService.isExpired(token)) {
            authStorageService.clearAdminToken();

            set({
              isAdminLogin: false,
              adminProfile: null,
            });

            return;
          }

          const profile = await authAdminApi.getProfile();

          set({
            adminProfile: profile,
            isAdminLogin: true,
          });
        } catch {
          authStorageService.clearAdminToken();

          set({
            isAdminLogin: false,
            adminProfile: null,
          });
        } finally {
          set({
            loading: false,
          });
        }
      },

      setError: (msg) => set({ error: msg }),
    }),
    { name: "admin-auth-store" },
  ),
);
