import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Khởi tạo cờ từ sessionStorage để giữ trạng thái khi F5
  isLogin: false, // Bạn có thể gắn logic kiểm tra token của bạn ở đây

  setIsLogin: (value) => set({ isLogin: value }),
}));
