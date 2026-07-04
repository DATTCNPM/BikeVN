import { create } from "zustand";
import { authStorageService } from "@repo/services";

interface AuthStore {
  isServerDown: boolean;
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  setIsServerDown: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // ✨ ĐÃ SỬA: Đọc cờ từ sessionStorage lúc khởi tạo ban đầu
  isServerDown:
    typeof window !== "undefined"
      ? sessionStorage.getItem("server_is_collapsed") === "true"
      : false,
  isLogin: !!authStorageService.getToken(),

  setIsServerDown: (value) => {
    if (typeof window !== "undefined") {
      if (value) {
        sessionStorage.setItem("server_is_collapsed", "true");
      } else {
        sessionStorage.removeItem("server_is_collapsed");
      }
    }
    set({
      isServerDown: value,
    });
  },
  setIsLogin: (value) =>
    set({
      isLogin: value,
    }),
}));
