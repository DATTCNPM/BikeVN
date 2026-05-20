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
      isLogin: !!authStorageService.getToken(),
      userProfile: undefined,
      loading: false,
      isServerDown: false,
      error: null,

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
          return response?.code === 1000;
        } catch (err) {
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
            set({ isLogin: true });
            await get().fetchProfile();
            return true;
          }
          return false;
        } catch (err) {
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
            set({ userProfile: response.result, isLogin: true });
          }
        } catch (err) {
          // ignore
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
            // ignore
          }
        }
        authStorageService.clearToken();
        set({ isLogin: false, userProfile: undefined });
        return true;
      },

      updateProfile: async (payload) => {
        set({ loading: true });
        try {
          const currentUser = get().userProfile;
          if (!currentUser) return false;
          const response = await userApi.updateUser(currentUser.id, payload);
          if (response?.code === 1000 && response.result) {
            set({ userProfile: response.result });
            return true;
          }
          return false;
        } catch (err) {
          return false;
        } finally {
          set({ loading: false });
        }
      },

      setError: (msg) => set({ error: msg }),
    }),
    { name: "admin-unused-auth-store" },
  ),
);
