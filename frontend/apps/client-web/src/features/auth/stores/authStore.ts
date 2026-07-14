import { authStorageService } from "@repo/services";
import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Khởi tạo cờ từ sessionStorage để giữ trạng thái khi F5
  isLogin:
    typeof window !== "undefined" ? !!authStorageService.getToken() : false,

  setIsLogin: (value) => set({ isLogin: value }),
}));
