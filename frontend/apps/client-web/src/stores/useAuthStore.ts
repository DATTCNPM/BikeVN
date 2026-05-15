import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authApi } from "@/api/authApi";
import type { User } from "@/lib/types";
import type { UpdateProfilePayload } from "@/api/authApi";

interface AuthState {
  isLogin: boolean;
  userProfile: User | undefined;
  loading: boolean;
  isServerDown: boolean;
  error: string | null;

  // Actions
  register: (userData: any) => Promise<boolean>;
  login: (credentials: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  fetchProfile: () => Promise<void>;
  setError: (msg: string | null) => void;
  updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // --- State ---
      isLogin: !!localStorage.getItem("token"),
      userProfile: null,
      loading: false,
      isServerDown: false,
      error: null,

      // --- Actions ---

      // 1. Hàm Register (Đã tối ưu phân loại lỗi)
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          await authApi.register(userData);
          set({ isServerDown: false });
          return true; // Để Component biết và chuyển hướng
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

      // 2. Hàm Login
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          if (response?.access_token) {
            localStorage.setItem("token", response.access_token);
            set({
              isLogin: true,
              userProfile: response.user,
              isServerDown: false,
            });
          }
          return true;
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

      // 3. Hàm Fetch Profile (Dùng khi F5 trang)
      fetchProfile: async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        set({ loading: true });
        try {
          const user = await authApi.getProfile();
          set({ userProfile: user, isLogin: true, isServerDown: false });
        } catch (err: any) {
          const status = err.response?.status;
          if (!status || status >= 500 || status === 404) {
            set({ isServerDown: true });
          } else if (status === 401) {
            localStorage.removeItem("token");
            set({ isLogin: false, userProfile: undefined });
          }
        } finally {
          set({ loading: false });
        }
      },

      // 4. Logout
      logout: async () => {
        const response = await authApi.logout();
        localStorage.removeItem("token");
        set({ isLogin: false, userProfile: undefined, error: null });
        if (response?.status === 200) {
          return true;
        } else {
          set({ error: "Đăng xuất thất bại" });
          return false;
        }
      },

      updateProfile: async (payload) => {
        set({
          loading: true,
          error: null,
        });

        try {
          const currentUser = get().userProfile;

          if (!currentUser) {
            throw {
              response: {
                status: 401,
                data: {
                  message: "Chưa đăng nhập",
                },
              },
            };
          }

          const response = await authApi.updateProfile(currentUser.id, payload);

          set({
            userProfile: response.user,
          });

          return true;
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
