import { create } from "zustand";
import { authStorageService } from "@repo/services";

interface AuthStore {
  isServerDown: boolean;
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  setIsServerDown: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isServerDown: false,
  isLogin: !!authStorageService.getToken(),

  setIsServerDown: (value) =>
    set({
      isServerDown: value,
    }),
  setIsLogin: (value) =>
    set({
      isLogin: value,
    }),
}));
