import { useQuery } from "@tanstack/react-query";
import { authApi } from "@repo/api"; // Đường dẫn đến file authApi của bạn

export const usePingQuery = () => {
  return useQuery({
    queryKey: ["auth", "ping"],
    queryFn: async () => {
      const response = await authApi.ping();
      return response.data;
    },
    // Bạn có thể thêm cấu hình này để tránh ping liên tục khi chuyển tab
    refetchOnWindowFocus: false,
    retry: false, // Không cần thử lại nhiều lần nếu server sập
  });
};
