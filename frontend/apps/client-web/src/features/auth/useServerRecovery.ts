import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "./authStore";

export const useServerRecovery = () => {
  const setIsServerDown = useAuthStore((state) => state.setIsServerDown);

  return useQuery({
    queryKey: ["server-recovery"],
    queryFn: async () => {
      // Gọi URL trực tiếp bằng axios gốc (thay vì instance nhiễm interceptor)
      // để bypass hoàn toàn lệnh window.location.href cũ, tránh bị loop redirect
      const response = await axios.get(
        "https://bikevn.onrender.com/auth/ping",
        {
          timeout: 2500, // Timeout ngắn để check nhanh
        },
      );

      // Nếu không có lỗi mạng, kiểm tra mã code thành công của hệ thống bạn
      if (response.data?.code === 1000) {
        // ✨ ĐÃ SỬA: Hàm này chạy sẽ xóa sạch cả state Zustand lẫn sessionStorage
        setIsServerDown(false);
        return "ONLINE";
      }

      throw new Error("Server response invalid");
    },
    retry: false,

    // ĐÓNG BĂNG CACHE: Ép React Query luôn xóa data cũ ngay lập tức, không dùng lại cache rác
    staleTime: 0,
    gcTime: 0,

    // Vòng lặp ping liên tục mỗi 3 giây cho đến khi hết lỗi
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });
};
