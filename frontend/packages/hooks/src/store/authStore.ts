import { create } from "zustand";

interface AuthStore {
  isServerDown: boolean;
  setIsServerDown: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isServerDown:
    typeof window !== "undefined"
      ? sessionStorage.getItem("server_is_collapsed") === "true"
      : false,

  setIsServerDown: (value) => {
    if (typeof window !== "undefined") {
      if (value) {
        sessionStorage.setItem("server_is_collapsed", "true");
      } else {
        sessionStorage.removeItem("server_is_collapsed");
      }
    }
    set({ isServerDown: value });
  },
}));
