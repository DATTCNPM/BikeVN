import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authStorageService } from "@repo/services";
import { authApi } from "@repo/api";
import type { RegisterPayload } from "@repo/types";
import { authKeys } from "./authKeys";
import { useAuthStore } from "./authStore";

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setIsLogin = useAuthStore((state) => state.setIsLogin);

  return useMutation({
    // 1. mutationFn: CHỈ gọi API và return data
    mutationFn: (userData: RegisterPayload) => authApi.register(userData),

    // 2. onSuccess: Xử lý toàn bộ side-effects sau khi API thành công
    onSuccess: async (response) => {
      // Lưu token vào localStorage/cookie
      authStorageService.setTokens(response.token, response.refreshToken);

      // Cập nhật state Zustand
      setIsLogin(true);

      // Kích hoạt fetch lại profile mới (vì đã có token hợp lệ)
      await queryClient.invalidateQueries({
        queryKey: authKeys.profile(),
      });

      // Bạn có thể thêm logic navigate về Home ở đây nếu muốn,
      // hoặc xử lý navigate ở phía Component gọi hook này đều được.
    },
  });
};
