import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authStorageService } from "@repo/services";
import { authApi } from "@repo/api";
import type { RegisterPayload } from "@repo/types";
import { authKeys } from "./authKeys";
import { useAuthStore } from "../stores/authStore";

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setIsLogin = useAuthStore((state) => state.setIsLogin);

  return useMutation({
    mutationFn: (userData: RegisterPayload) => authApi.register(userData),

    // 🌟 BỔ SUNG TẠI ĐÂY: Ẩn Toast lỗi trùng email để component xử lý dưới ô input
    meta: {
      silentErrorCodes: [1002],
    },

    onSuccess: async (response) => {
      authStorageService.setTokens(response.token, response.refreshToken);
      setIsLogin(true);
      await queryClient.invalidateQueries({
        queryKey: authKeys.profile(),
      });
    },
  });
};
