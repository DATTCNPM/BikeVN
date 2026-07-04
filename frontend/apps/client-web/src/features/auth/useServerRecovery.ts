import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "./authStore";

export const useServerRecovery = () => {
  const setIsServerDown = useAuthStore((state) => state.setIsServerDown);

  return useQuery({
    queryKey: ["server-recovery"],
    queryFn: async () => {
      const response = await axios.get(
        "https://bikevn.onrender.com/auth/ping",
        {
          timeout: 2500,
        },
      );

      if (response.data?.code === 1000) {
        // ✨ ĐÃ SỬA: Hàm này giờ sẽ kiêm dọn dẹp sessionStorage luôn
        setIsServerDown(false);
        return "ONLINE";
      }

      throw new Error("Server response invalid");
    },
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });
};
