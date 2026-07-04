import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/authStore"; // Import từ package store dùng chung

export const useServerHealthCheck = (apiUrl?: string) => {
  const setIsServerDown = useAuthStore((state) => state.setIsServerDown);
  const isServerDown = useAuthStore((state) => state.isServerDown);

  // Cho phép truyền URL từ biến môi trường của từng App (Client/Admin), mặc định là bikevn
  const baseUrl = apiUrl || "https://bikevn.onrender.com";

  return useQuery({
    queryKey: ["server-health", baseUrl],
    queryFn: async () => {
      try {
        const response = await axios.get(`${baseUrl}/auth/test`, {
          timeout: 4000,
        });

        if (response.data?.code === 1000) {
          setIsServerDown(false);
          return "ONLINE";
        }
        throw new Error("Cấu trúc phản hồi không hợp lệ");
      } catch (error) {
        setIsServerDown(true);
        throw error;
      }
    },
    refetchInterval: isServerDown ? 3000 : 45000,
    refetchIntervalInBackground: true,
    retry: false,
    staleTime: 10000,
    gcTime: 0,
  });
};
