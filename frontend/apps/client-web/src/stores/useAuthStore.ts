import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authApi, userApi } from "@repo/api";
import { authStorageService } from "@repo/services";
import type { User } from "@repo/types";
import type { UpdateProfileSchema } from "@repo/schemas";

interface AuthState {
  isLogin: boolean;
  userProfile: User | undefined;
  loading: boolean;
  isServerDown: boolean;
  error: string | null;

  // Actions
  ping: () => Promise<void>;
  register: (userData: any) => Promise<boolean>;
  login: (credentials: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  fetchProfile: () => Promise<void>;
  setError: (msg: string | null) => void;
  updateProfile: (payload: UpdateProfileSchema) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // --- State ---
      isLogin: !!authStorageService.getToken(),
      userProfile: undefined,
      loading: false,
      isServerDown: false,
      error: null,

      // --- Actions ---
      ping: async () => {
        try {
          const response = await authApi.ping();
          console.log("Ping response:", response);
          set({ isServerDown: false });
        } catch (err) {
          console.error("Ping failed:", err);
          set({ isServerDown: true });
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const payload = {
            name: userData.name,
            email: userData.email,
            passwordHash: userData.password,
            phone: userData.phone || undefined,
            cccdNumber: userData.cccdNumber || undefined,
          };
          const response = await authApi.register(payload);
          if (response?.code === 1000) {
            set({ isServerDown: false });
            return true;
          }
          set({ error: response?.message || "Đăng ký thất bại" });
          return false;
        } catch (err: any) {
          const status = err.response?.status;
          const msg = err.response?.data?.message || "Đăng ký thất bại";

          if (!status || status >= 500 || status === 404) {
            set({ isServerDown: true });
          } else {
            set({ error: msg, isServerDown: false });
          }
          return false;
        } finally {
          set({ loading: false });
        }
      },

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          if (response?.code === 1000 && response.result?.token) {
            authStorageService.setToken(response.result.token);
            set({
              isLogin: true,
              isServerDown: false,
            });
            await get().fetchProfile();
            return true;
          }
          set({ error: response?.message || "Sai tài khoản hoặc mật khẩu" });
          return false;
        } catch (err: any) {
          const status = err.response?.status;
          if (!status || status >= 500 || status === 404) {
            set({ isServerDown: true });
          } else {
            set({
              error:
                err.response?.data?.message || "Sai tài khoản hoặc mật khẩu",
            });
          }
          return false;
        } finally {
          set({ loading: false });
        }
      },

      fetchProfile: async () => {
        const token = authStorageService.getToken();
        if (!token) return;

        set({ loading: true });
        try {
          const response = await authApi.getProfile();
          if (response?.code === 1000 && response.result) {
            set({ userProfile: response.result, isLogin: true, isServerDown: false });
          } else {
            authStorageService.clearToken();
            set({ isLogin: false, userProfile: undefined });
          }
        } catch (err: any) {
          const status = err.response?.status;
          if (!status || status >= 500 || status === 404) {
            set({ isServerDown: true });
          } else {
            authStorageService.clearToken();
            set({ isLogin: false, userProfile: undefined });
          }
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        const token = authStorageService.getToken();
        if (token) {
          try {
            await authApi.logout(token);
          } catch (err) {
            console.error("Logout request failed:", err);
          }
        }
        authStorageService.clearToken();
        set({ isLogin: false, userProfile: undefined, error: null });
        return true;
      },

      updateProfile: async (payload) => {
        set({
          loading: true,
          error: null,
        });

        try {
          const currentUser = get().userProfile;

          if (!currentUser) {
            throw new Error("Chưa đăng nhập");
          }

          const response = await userApi.updateUser(currentUser.id, payload);

          if (response?.code === 1000 && response.result) {
            set({
              userProfile: response.result,
            });
            return true;
          }
          
          set({ error: response?.message || "Cập nhật thất bại" });
          return false;
        } catch (err: any) {
          set({
            error:
              err.response?.data?.message || err.message || "Cập nhật thất bại",
          });

          return false;
        } finally {
          set({
            loading: false,
          });
        }
      },

      setError: (msg) => set({ error: msg }),
    }),
    { name: "auth-store" },
  ),
);
