import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authApi } from "@repo/api";
import type { User } from "@repo/types";
import type { LoginSchema } from "./schemas";

interface AdminAuthState {
  isAdminLogin: boolean;
  adminProfile: User | null;
  loading: boolean;
  error: string | null;

  loginAdmin: (credentials: LoginSchema) => Promise<boolean>;
  logoutAdmin: () => Promise<boolean>;
  fetchAdminProfile: () => Promise<void>;
  setError: (msg: string | null) => void;
}

export const useAdminAuth = create<AdminAuthState>()(
  devtools(
    (set) => ({
      isAdminLogin: !!localStorage.getItem("admin_token"),
      adminProfile: null,
      loading: false,
      error: null,

      loginAdmin: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          
          if (response?.user?.role !== "admin") {
            set({ error: "Tài khoản không có quyền quản trị viên" });
            return false;
          }

          if (response?.access_token) {
            localStorage.setItem("admin_token", response.access_token);
            set({
              isAdminLogin: true,
              adminProfile: response.user as User,
            });
          }
          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Sai tài khoản hoặc mật khẩu",
          });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      logoutAdmin: async () => {
        set({ loading: true });
        try {
          await authApi.logout();
          localStorage.removeItem("admin_token");
          set({ isAdminLogin: false, adminProfile: null, error: null });
          return true;
        } catch (err) {
          set({ error: "Đăng xuất thất bại" });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      fetchAdminProfile: async () => {
        const token = localStorage.getItem("admin_token");
        if (!token) return;

        set({ loading: true });
        try {
          const user = await authApi.getProfile();
          if (user?.role !== "admin") {
            localStorage.removeItem("admin_token");
            set({ isAdminLogin: false, adminProfile: null });
            return;
          }
          set({ adminProfile: user as User, isAdminLogin: true });
        } catch (err: any) {
          localStorage.removeItem("admin_token");
          set({ isAdminLogin: false, adminProfile: null });
        } finally {
          set({ loading: false });
        }
      },

      setError: (msg) => set({ error: msg }),
    }),
    { name: "admin-auth-store" },
  ),
);
