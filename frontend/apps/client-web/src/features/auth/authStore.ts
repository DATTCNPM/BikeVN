import { create } from "zustand";
import { authStorageService } from "@repo/services";

interface AuthStore {
  isServerDown: boolean;
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  setIsServerDown: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // ✨ ĐÃ SỬA: Khởi tạo giá trị ban đầu bằng cách check sessionStorage để tránh bị reset về false khi reload trang
  isServerDown:
    typeof window !== "undefined"
      ? sessionStorage.getItem("server_is_collapsed") === "true"
      : false,
  isLogin: !!authStorageService.getToken(),

  setIsServerDown: (value) => {
    //Đồng bộ trạng thái vào cả sessionStorage để giữ state khi reload trang
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
