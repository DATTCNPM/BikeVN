import { create } from "zustand";
import { authStorageService } from "@repo/services";

interface AuthStore {
  isServerDown: boolean;
  isLogin: boolean;

  setIsServerDown: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isServerDown: false,
  isLogin: !!authStorageService.getToken(),

  setIsServerDown: (value) =>
    set({
      isServerDown: value,
    }),
}));
