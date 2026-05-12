import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { registerUser, loginUser, getUserCurrent } from "../api/authAPI";

interface AuthState {
  isLogin: boolean;
  userProfile: any | null;
  loading: boolean;
  isServerDown: boolean;
  error: string | null;

  // Actions
  register: (userData: any) => Promise<boolean>;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  setError: (msg: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
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
          await registerUser(userData);
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
          const response = await loginUser(credentials);
          if (response?.token) {
            localStorage.setItem("token", response.token);
            set({
              isLogin: true,
              userProfile: response.user,
              isServerDown: false,
            });
          }
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
          throw err;
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
          const user = await getUserCurrent();
          set({ userProfile: user, isLogin: true, isServerDown: false });
        } catch (err: any) {
          const status = err.response?.status;
          if (!status || status >= 500 || status === 404) {
            set({ isServerDown: true });
          } else if (status === 401) {
            localStorage.removeItem("token");
            set({ isLogin: false, userProfile: null });
          }
        } finally {
          set({ loading: false });
        }
      },

      // 4. Logout
      logout: () => {
        localStorage.removeItem("token");
        set({ isLogin: false, userProfile: null, error: null });
      },

      setError: (msg) => set({ error: msg }),
    }),
    { name: "auth-store" },
  ),
);
