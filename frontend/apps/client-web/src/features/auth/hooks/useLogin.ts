import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@repo/api";
import { authStorageService } from "@repo/services";
import { authKeys } from "./authKeys";
import { useAuthStore } from "../stores/authStore";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setIsLogin = useAuthStore((state) => state.setIsLogin);

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authApi.login(credentials),

    // 🌟 KHAI BÁO ĐỘNG TẠI ĐÂY: Ẩn các mã lỗi validation của Form, các lỗi khác (ví dụ: 500, 9999) vẫn bắn Toast bth
    meta: {
      silentErrorCodes: [1002, 1003, 1004],
    },

    onSuccess: async (auth) => {
      authStorageService.setTokens(auth.token, auth.refreshToken);
      setIsLogin(true);
      await queryClient.invalidateQueries({
        queryKey: authKeys.profile(),
      });
    },
  });
};
