// @/features/auth/useLogin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@repo/api";
import { authStorageService } from "@repo/services";
import { authKeys } from "./authKeys";
import { useAuthStore } from "./authStore";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setIsLogin = useAuthStore((state) => state.setIsLogin);

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authApi.login(credentials),

    // 🌟 ĐÃ THÊM TỪ TRƯỚC: Chặn không cho Global Cache (QueryProvider) bắn toast lỗi lên màn hình
    meta: { showToast: false },

    // 🌟 CHỈ LÀM SIDE-EFFECTS HỆ THỐNG TẠI ĐÂY
    onSuccess: async (auth) => {
      authStorageService.setTokens(auth.token, auth.refreshToken);
      setIsLogin(true);
      await queryClient.invalidateQueries({
        queryKey: authKeys.profile(),
      });
    },
  });
};
