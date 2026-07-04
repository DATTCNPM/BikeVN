import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const usePingQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["auth", "ping"],
    queryFn: async () => {
      // ✨ ĐÃ SỬA: Dùng axios trực tiếp để tránh dính interceptor điều hướng
      const response = await axios.get(
        "https://bikevn.onrender.com/auth/ping",
        {
          timeout: 2500,
        },
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  });
};
